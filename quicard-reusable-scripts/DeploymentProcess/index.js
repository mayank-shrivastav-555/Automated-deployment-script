const fs = require('fs');
const fs_extra = require('fs-extra');
const path = require('path');
const { Client } = require('ssh2');
const ClientSFTP = require('ssh2-sftp-client');
const simpleGit = require('simple-git');
const { FILE_DATA_TYPE, BOOLEAN, TEMPORARY_FOLDER, S3FOLDERS, FILE_EXTENSION, BACKUP_FILENAME } = require('./constants/constants');
const archiver = require('archiver');
const mysqldump = require('mysqldump');
const mysql = require('mysql2/promise');
const { uploadToS3 } = require('./helper/uplaods3');
const { getSecretKey } = require('./helper/getKey');
const {ec2Configuration, configuration ,mysqlConfig,awsCredentials} = require("./config");


// async function backupRepository(sftpConnection, configuration) {
//     try {
//         const { fileExclude, localDirectory, ec2RepoDir } = configuration;
//         const filterFiles = (filePath, isDirectory) => {
//             return !fileExclude.some(path => filePath.endsWith(`/${path}`));
//         };
//         if (!fs.existsSync(localDirectory)) fs.mkdirSync(localDirectory);
//         await sftpConnection.downloadDir(ec2RepoDir, localDirectory, { filter: filterFiles, useFastget: BOOLEAN.TRUE });
//         console.log('Files Backed up successfully from EC2 instance');
//     } catch (err) {
//         console.error('Files Backed up successfully from EC2 instance:', err);
//         throw err;
//     }
// }

async function backupRepository(sftpConnection, configuration) {
    try {
        const { fileExclude, ec2RepoDir } = configuration;

        const filterFiles = (filePath, isDirectory) => {
            return !fileExclude.some(path => filePath.endsWith(`/${path}`));
        };

        const temporaryDirectory = TEMPORARY_FOLDER;
        const repoTemporaryDirectory = `${temporaryDirectory}/${path.basename(ec2RepoDir)}`;

        if (!fs.existsSync(temporaryDirectory)) fs.mkdirSync(temporaryDirectory, { recursive: BOOLEAN.TRUE });
        if (!fs.existsSync(repoTemporaryDirectory)) fs.mkdirSync(repoTemporaryDirectory, { recursive: BOOLEAN.TRUE });

        await sftpConnection.downloadDir(ec2RepoDir, repoTemporaryDirectory, { filter: filterFiles, useFastget: BOOLEAN.TRUE });
        console.log('Repository downloaded successfully');

        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const zipFilePath = `${temporaryDirectory}/${path.basename(ec2RepoDir)}_${timestamp}${FILE_EXTENSION.ZIP}`;
         const output = fs.createWriteStream(zipFilePath);
        // const archive = archiver('zip', { zlib: { level: 9 } });'
        const archive = archiver(FILE_DATA_TYPE.ZIP);

        const archivePromise = new Promise((resolve, reject) => {
            output.on('close', resolve);
            archive.on('error', reject);
        });

        archive.pipe(output);
        archive.directory(repoTemporaryDirectory, BOOLEAN.FALSE);
        archive.finalize();

        await archivePromise;
        console.log('Zip file created successfully');

      await uploadToS3(zipFilePath, S3FOLDERS.CODE);
        console.log('Zip file uploaded to S3 successfully');

        fs.unlinkSync(zipFilePath);
        await fs.promises.rm(repoTemporaryDirectory, { recursive: BOOLEAN.TRUE });
        await fs.promises.rm(temporaryDirectory, { recursive: BOOLEAN.TRUE});
        console.log('Temporary directory and zip file deleted');

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
async function backupMySQLDatabase(mysqlConfig) {
    try {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const dumpFileName = `${BACKUP_FILENAME}${timestamp}${FILE_EXTENSION.SQL}`;
        await mysqldump({
            connection: {
                host: mysqlConfig.host,
                user: mysqlConfig.user,
                password: mysqlConfig.password,
                database: mysqlConfig.database,
            },
            dumpToFile: `./${dumpFileName}`, 
        });
       await uploadToS3(`./${dumpFileName}`, S3FOLDERS.DATABASE);
        console.log('MySQL database backup uploaded to S3 successfully');

        fs.unlinkSync(`./${dumpFileName}`);
        console.log('Local backup file deleted successfully');
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
async function deleteServerFile(sftpConnection, configuration) {
    try {
        const { fileExclude, ec2RepoDir } = configuration;
        const directoryList = (await sftpConnection.list(ec2RepoDir)).map(data => {
            if (!fileExclude.includes(data.name)) {
                return {
                    type: data.type,
                    name: data.name
                }
            }
        })
        for (const data of directoryList) {
            if (data && data.type == FILE_DATA_TYPE.DIRECTORY) {
                await sftpConnection.rmdir(`${ec2RepoDir}/${data.name}`, BOOLEAN.TRUE)
            }
            else if (data && data.type == FILE_DATA_TYPE.FILE) {
                await sftpConnection.delete(`${ec2RepoDir}/${data.name}`)
            }
        }
        console.log('Files deleted successfully from EC2 instance');
    } catch (err) {
        console.error('Files deleted successfully from EC2 instance:', err);
        throw err
    }
}

async function uploadDirToEc2(sftpConnection, configuration) {
    try {
        const options = {
            filter: (src, dest) => {
                return !configuration.fileExclude.includes(path.basename(src));
            }
        };
        if (!fs.existsSync(configuration.tempFolder)) fs.mkdirSync(configuration.tempFolder)
        await fs_extra.copy(configuration.latestRepo, configuration.tempFolder, options);
        await sftpConnection.uploadDir(configuration.tempFolder, configuration.ec2RepoDir);
        console.log('Files uploaded successfully to EC2 instance');
    } catch (error) {
        console.log(error)
        throw error;
    } finally {
        await fs_extra.remove(configuration.tempFolder)
    }
}

function getFirstDirectory(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, { withFileTypes: BOOLEAN.TRUE }, (err, entries) => {
            if (err) reject(err);
            const directories = entries.filter(entry => entry.isDirectory() && !/\./.test(entry.name));
            resolve(directories[0].name)
        });
    });
}

async function uploadGitRepoToEc2(sftpConnection, configuration) {
    try {
        const git = simpleGit();
        if (!fs.existsSync(configuration.tempFolder)) fs.mkdirSync(configuration.tempFolder)
        await git.clone(configuration.repositoryUrl, configuration.tempFolder, [`--branch=${configuration.masterbranchUrl}`])
        await Promise.all(configuration.fileExclude.map(async item => {
            const fullPath = path.join(configuration.tempFolder, item);
            if (await fs_extra.pathExists(fullPath)) await fs_extra.remove(fullPath);
        }));
        // const dirName= await getFirstDirectory( path.join(configuration.tempFolder))
        console.log('Repository cloned successfully.');
        await sftpConnection.uploadDir(`${configuration.tempFolder}`, configuration.ec2RepoDir);
        console.log('Files uploaded successfully to EC2 instance');
    } catch (error) {
        console.log(error)
        throw error;
    } finally {
        await fs_extra.remove(configuration.tempFolder)
    }
}

async function commandExecution(ec2Configuration) {
    const connection = new Client();
    connection.on('ready', () => {
        console.log('SSH Connection Established');

        // Start a shell session
        connection.shell((err, stream) => {
            if (err) throw err;
            // Handle output
            stream.on('close', () => {
                console.log('Stream closed');
                connection.end();
            }).on('data', (data) => {
                console.log('Output:', data.toString());
            }).stderr.on('data', (data) => {
                console.error('Error:', data.toString());
            });


            // Execute sudo su
            stream.write('sudo su\n');
            stream.write(`cd ${configuration.ec2RepoDir}/\n`);
            stream.write('npm i\n');
            stream.write('pm2 kill\n');
            stream.write('pm2 start index.js\n');
            stream.write(`node -e "const config = require('./config/index.js'); 
            const { host, port, name, user, password } = config.db_settings; 
            console.log(\`mysql -h \${host} -p \${port} -U \${user} -d \${name} -c 'SQL command;'\`);"'\n`);
        });
    }).connect(ec2Configuration);
}

async function insertMySQLData(mysqlConfig) {
    const dirPath = path.join(__dirname, './sql_files');
    try {
        mysqlConfig.multipleStatements = BOOLEAN.TRUE;
        const connection = await mysql.createConnection(mysqlConfig);
        const files = fs.readdirSync(dirPath).filter(file => file.endsWith(FILE_EXTENSION.SQL));
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const sql = fs.readFileSync(filePath, FILE_DATA_TYPE.UTF);
            await connection.query(sql);
            console.log(`Executed ${file} successfully.`);
        }
      console.log('SQL file executed successfully.');
       await connection.end();
    } catch (error) {
      console.error('Error executing SQL file:', error);
    }
  }
  
  async function deleteSecretkeyFile(filePath){
    try {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} deleted successfully`);
    } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
        throw err;
    }
}

async function backupAndUploadRepoToEc2() {
    const connection = new Client();
    const sftpConnection = new ClientSFTP();
    try {
        // await getSecretKey(configuration.secretName,configuration.temporaryKeyFile);
        // ec2Configuration.privateKey = fs.readFileSync(configuration.temporaryKeyFile);
        await connection.connect(ec2Configuration);
        await sftpConnection.connect(ec2Configuration);
        await backupRepository(sftpConnection, configuration);
        await backupMySQLDatabase(mysqlConfig);
        await insertMySQLData(mysqlConfig);
        await deleteServerFile(sftpConnection, configuration);
        // await uploadDirToEc2(sftpConnection,configuration);
        await uploadGitRepoToEc2(sftpConnection, configuration);
        await commandExecution(ec2Configuration);
        // await deleteSecretkeyFile(configuration.temporaryKeyFile);
    } catch (error) {
        console.log(error)
        return error
    } finally {
        await sftpConnection.end();
        await connection.end();
    }
}

backupAndUploadRepoToEc2()
