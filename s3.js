const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();

const fs = require('fs'); // node file stream

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

// upload file to S3
function uploadImage(image) {
  const fileStream = fs.createReadStream(image.path);

  const uploadArgs = {
    Bucket: bucketName,
    Body: fileStream,
    Key: image.filename // filename multer created
  }

  return s3.upload(uploadArgs).promise();
}

exports.uploadImage = uploadImage;

// download file from S3
function downloadImage(fileKey) {
  const downloadArgs = {
    Key: fileKey,
    Bucket: bucketName
  }
  return s3.getObject(downloadArgs).createReadStream();
}

exports.downloadImage = downloadImage;


// delete file from S3
