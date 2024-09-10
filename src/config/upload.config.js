const mutler = require("multer");

const storage = mutler.memoryStorage();

// filter => allow only image files in png and jpeg
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
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  }
};

const uploads = mutler({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limits files size to 5mb
  },
  fileFilter: fileFilter,
});

module.exports = uploads;
