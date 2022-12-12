
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk');
const secrets = require('../config/secrets');
const app = express()

AWS.config.update({
  secretAccessKey:secrets.AWS_SECRETACCESSKEY,
  accessKeyId:secrets.AWS_ACCESSKEYID,
  region:secrets.REGION
});



const s3 = new AWS.S3()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};


const fileUpload = multer({
    limits: 500000,
  storage: multerS3({
    s3: s3,
    bucket: 'petstagram-images',
    acl:'public-read',
    contentType:function (req, file, cb) {
      cb(null, file.mimetype)
    },
    key: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now().toString()+ '.' +extension)
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type !');
    cb(error, isValid);
},
})


module.exports=fileUpload;