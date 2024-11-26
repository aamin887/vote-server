const gcsBucket = require("../config/gcs.config");

const gcsUploader = (fileBuffer, fileName) => {
  const file = gcsBucket.file(fileName);

  console.log("file Id => ", file.id);
  console.log("file Id => ", file.name);

  const blobStream = file.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(err);
    });
    blobStream.on("finish", () => {
      resolve({
        url: `https://storage.googleapis.com/aminmakes/${file.id}`,
        name: file.name,
      });
    });
    blobStream.end(fileBuffer);
  });
};

const gcsDelete = async (fileName) => {
  try {
    // Get a reference to the file in the bucket
    const file = gcsBucket.file(fileName);

    // Delete the file
    await file.delete();
    console.log(`File ${fileName} deleted from bucket.`);
  } catch (error) {
    console.error(`Failed to delete file ${fileName} from bucket :`, error);
  }
};

module.exports = { gcsDelete, gcsUploader };
