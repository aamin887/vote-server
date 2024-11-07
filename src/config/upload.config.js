const mutler = require("multer");

const storage = mutler.memoryStorage();

// filter => allow only image files in png, jpeg and svg+xml
const fileFilter = (req, file, cb) => {
  const allowedMimeType = [
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
    "image/png",
  ];

  if (allowedMimeType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and  svg+xml are allowed.")
    );
  }
};

const uploads = mutler({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // limits files size to 2mb
  },
  fileFilter: fileFilter,
});

module.exports = uploads;
