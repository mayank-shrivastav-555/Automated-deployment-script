const {awsCredentials,configuration} = require('../config.js');
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

async function getSecretKey(secretName, filePath) {
    const secretsManager = new AWS.SecretsManager({ credentials: awsCredentials });
    try {
        const secretManagerData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        const secretString = secretManagerData.SecretString;
        const keySearchString = `"${configuration.secretName}":"`;
        // const startIndex = secretString.indexOf('"vapt_qid_key":"') + '"vapt_qid_key":"'.length;
        const keyStartIndex = secretString.indexOf(keySearchString) + keySearchString.length;
        const keyEndIndex = secretString.indexOf('"', keyStartIndex);
        const secretValue = secretString.substring(keyStartIndex, keyEndIndex);
        fs.writeFileSync(filePath, secretValue);
        console.log(`${secretName} written to ${filePath}`);
    } catch (err) {
        console.error(`Failed to retrieve secret ${secretName}:`, err);
        throw err;
    }
}

module.exports = {
    getSecretKey
}
