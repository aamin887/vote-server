const gcsBucket = require("../config/gcs.config");

const gcsUploader = (fileBuffer, fileName) => {
  const file = gcsBucket.file(fileName);

  const blobStream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(err);
    });
    blobStream.on("finish", () => {
      resolve(`https://storage.googleapis.com/aminmakes/${file.id}`);
    });
    blobStream.end(fileBuffer);
  });
};

module.exports = gcsUploader;
