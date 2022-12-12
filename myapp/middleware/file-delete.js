const aws = require('aws-sdk');
 

aws.config.update({
  secretAccessKey: 'gcXYx7XZ6EpGsqFjaKFHDIEUbxVZZv6js+9LC/Af',
  accessKeyId:'AKIAQBBXVJZMKLAPC26D',
  region:'us-east-2'
});
const s3 = new aws.S3();
 
const fileDelete = async (imagePath) => {
    const filename = imagePath.split('/').pop();
    const params = { Bucket:'petstagram-images', Key: filename };
 
 
    s3.headObject(params)
        .promise()
        .then(
            (data) => {
                console.log('File Found in S3');
                s3.deleteObject(params)
                    .promise()
                    .then(
                        () => console.log('file deleted Successfully'),
                        //prettier-ignore
                        () => console.log('ERROR in file Deleting :' + JSON.stringify(err))
                    );
            },
            (err) => console.log('File not Found ERROR : ' + err.code)
        );
 
};
 
module.exports = fileDelete;
 