const FILE_DATA_TYPE={
    DIRECTORY:"d",
    FILE:"-",
    ZIP:"zip",
    UTF:'utf-8'
}
const USER_NAME={
    UBUNTU:"ubuntu"
}
const PORT =22
const REPOSITORY_URL={
    QID:"http://192.168.1.35:3000/QID-Platform/qid-backend-apis.git"
}
const FILE_EXCLUDES={
    NODE_MODULES:"node_modules",
    PACKAGE_LOCK_JSON:"package-lock.json",
    LOGS:"logs"
}
const TEMPORARY_FOLDER="tempFolder"
const OPTDIRECTORY="/opt/"
const BACKUP_FILENAME="Backup_repo"
const PROJECT_NAME={
    QID:"QID"
}
const BOOLEAN={
    TRUE:true,
    FALSE:false
}
const S3FOLDERS={
    CODE:"backUp/",
    DATABASE:"database/"
}
const FILE_EXTENSION={
    ZIP:".zip"  ,
    SQL:".sql"
}
module.exports={FILE_DATA_TYPE,USER_NAME,PORT,REPOSITORY_URL,FILE_EXCLUDES,TEMPORARY_FOLDER,OPTDIRECTORY,BACKUP_FILENAME,PROJECT_NAME,BOOLEAN,S3FOLDERS,FILE_EXTENSION}