const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { USER_NAME, PORT, REPOSITORY_URL, FILE_EXCLUDES, TEMPORARY_FOLDER, BACKUP_FILENAME, PROJECT_NAME, OPTDIRECTORY } = require('./constants/constants');

const envConfig = {
    dev: {
        backupFolderName: "dev",
        host:'13.234.177.0',
        ec2FolderName:"QID",
        port:PORT,
        username:USER_NAME.UBUNTU,
        privatekey:'QID_QA_KEY.pem',
        masterbranchUrl: 'develop-features',
        mysqlHost:'qiddatabase-dev.cldbvli6jsrd.ap-south-1.rds.amazonaws.com',
        mysqlPort:3306,
        mysqlUser:'admin',
        mysqlPassword:'QIDmyPass45#',
        mysqlDatabase:'qui_card',
        secretName:'vapt_qid_key',
        temporaryKeyFile: 'temporary_key',
    },
    uat: {
        backupFolderName: "uat",
        host: '13.234.177.0',
        ec2FolderName: "QID",
        port: PORT,
        username: USER_NAME.UBUNTU,
        privatekey: 'QID_QA_KEY.pem',
        masterbranchUrl: 'develop-features',
    },
    vapt:{
        backupFolderName: "dev",
        host:'13.234.177.0',
        ec2FolderName: "QID",
        port: PORT,
        username: USER_NAME.UBUNTU,
        privatekey: 'QID_QA_KEY.pem',
        masterbranchUrl: 'quicard-develop',        
        mysqlHost:'qiddatabase-dev.cldbvli6jsrd.ap-south-1.rds.amazonaws.com',
        mysqlPort:3306,
        mysqlUser:'admin',
        mysqlPassword:'QIDmyPass45#',
        mysqlDatabase:'qui_card',
        secretName:'vapt_qid_key',
        temporaryKeyFile: 'temporary_key',
    },
    qa: {
        backupFolderName: "qa",
        host:'13.234.177.0',
        ec2FolderName:"QID",
        port:PORT,
        username:USER_NAME.UBUNTU,
        privatekey:'QID_QA_KEY.pem',
        masterbranchUrl: 'develop-features',
    },
    sandbox:{
        backupFolderName: "sandbox",
        host:'13.234.177.0',
        ec2FolderName:"QID",
        port:PORT,
        username:USER_NAME.UBUNTU,
        privatekey:'QID_QA_KEY.pem',
        masterbranchUrl: 'develop-features', 
    },
    validate_qa: {
        backupfoldername: "qa",
        host: '13.126.165.199',
        ec2FolderName: "skyggebackend",
        port: 22,
        username: "ubuntu",
        privatekey: 'keyy_qa',
        mysqlHost:'127.0.0.1',
        mysqlPort:3306,
        mysqlUser:'root',
        mysqlPassword:'Sql@15',
        mysqlDatabase:'qui_card_dem',

    }
}
module.exports = {
    ec2Configuration: {
        host: envConfig[process.env.NODE_ENV].host,
        port: envConfig[process.env.NODE_ENV].port,
        username: envConfig[process.env.NODE_ENV].username,
        privateKey: fs.readFileSync(envConfig[process.env.NODE_ENV].privatekey)
        // privateKey: fs.readFileSync(envConfig[process.env.NODE_ENV].temporaryKeyFile)
    },
    // configuration: {
    //     localDirectory: path.join(__dirname, `${BACKUP_FILENAME}/${PROJECT_NAME.QID}_${envConfig[process.env.NODE_ENV].backupFolderName}_${new Date().toLocaleString().slice(0, 25).replace(/[://" " ,]/g, " ")}`),
    //     fileExclude: [FILE_EXCLUDES.NODE_MODULES,FILE_EXCLUDES.PACKAGE_LOCK_JSON,FILE_EXCLUDES.LOGS],
    //     ec2RepoDir: `${OPTDIRECTORY}${envConfig[process.env.NODE_ENV].ec2FolderName}`,
    //     // latestRepo: `Backup_repo/Skygge_QA_2 5 2024  5 25 13 pm`,
    //     tempFolder: TEMPORARY_FOLDER,
    //     repositoryUrl: REPOSITORY_URL.QID,
    //     masterbranchUrl: envConfig[process.env.NODE_ENV].masterbranchUrl,
    // },
    configuration: {
        localDir: path.join(__dirname, `Backup_repo/${"Skygge"}_${envConfig[process.env.NODE_ENV].backupfoldername}_${new Date().toLocaleString().slice(0, 25).replace(/[://" " ,]/g, " ")}`),
        fileExclude: ["node_modules", "package-lock.json", "logs"],
        ec2RepoDir: `/opt/${envConfig[process.env.NODE_ENV].ec2FolderName}`,
        latestRepo: `Backup_repo/Skygge_QA_2 5 2024  5 25 13 pm`,
        tempFolder: "tempFolder",
        repoUrl: "http://192.168.1.35:3000/Skygge_Validate/validate-backend-server.git",
        masterbranchUrl: 'Phase-4/features/SKYVALIDATE-704-Bug-Fixes',
        // secretName: envConfig[process.env.NODE_ENV].secretName,
        // temporaryKeyFile: envConfig[process.env.NODE_ENV].temporaryKeyFile
    },
    mysqlConfig:{
        host:envConfig[process.env.NODE_ENV].mysqlHost,
        port:envConfig[process.env.NODE_ENV].mysqlPort,
        user:envConfig[process.env.NODE_ENV].mysqlUser,
        password:envConfig[process.env.NODE_ENV].mysqlPassword,
        database:envConfig[process.env.NODE_ENV].mysqlDatabase,
    },
     awsCredentials : {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: 'ap-south-1'
    }    
};