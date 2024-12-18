const sharp = require("sharp");
const gcsBucket = require("../config/gcs.config");
require("dotenv").config();

const gcsUploader = async (fileBuffer, fileName, userName = "") => {
  // Resize the file buffer using sharp
  const resizedBuffer = await sharp(fileBuffer).resize(323, 380).toBuffer();

  // Rename the file (e.g., add a timestamp or unique identifier)
  const timestamp = Date.now();
  const fileExtension = fileName.split(".").pop(); // Extract file extension

  let newFileName = `${userName
    .split(" ")
    .join("_")
    .toLocaleUpperCase()}_${timestamp}`.toUpperCase();
  newFileName = `${newFileName}.${fileExtension}`;

  const file = gcsBucket.file(newFileName);

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
    blobStream.end(resizedBuffer);
  });
};

const gcsDelete = async (fileName) => {
  try {
    // Get a reference to the file in the bucket
    await gcsBucket.file(fileName).delete();

    console.log(`File ${fileName} deleted from bucket.`);
  } catch (error) {
    console.error(`Failed to delete file ${fileName} from bucket :`, error);
  }
};

module.exports = { gcsDelete, gcsUploader };
