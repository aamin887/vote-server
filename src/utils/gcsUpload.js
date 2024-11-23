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

const gcsDelete = async (fileBuffer, fileName) => {
  try {
    // Get a reference to the file in the bucket
    const file = gcsBucket.file(fileName);

    // Delete the file
    await file.delete();
    console.log(`File ${fileName} deleted from bucket ${bucketName}.`);
  } catch (error) {
    console.error(
      `Failed to delete file ${fileName} from bucket ${bucketName}:`,
      error
    );
  }
};

module.exports = { gcsDelete, gcsUploader };
