const awsCredentials= require('../config.js').awsCredentials;
const fs = require('fs');
const dotenv = require('dotenv').config();
const AWS = require('aws-sdk');
const path = require('path');
async function uploadToS3(filePath, s3KeyPrefix = '') {
    try {
        const s3 = new AWS.S3({
            credentials: awsCredentials
        });

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${s3KeyPrefix}${path.basename(filePath)}`,
            Body: fs.createReadStream(filePath),
        };

        await s3.upload(params).promise();
        console.log(`File ${filePath} uploaded to S3 successfully`);

        // fs.unlinkSync(filePath);
        // console.log(`Local file ${filePath} deleted successfully`);
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
module.exports={
    uploadToS3
}