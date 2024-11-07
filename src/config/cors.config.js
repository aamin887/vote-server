const allowedLists = require("./allowedLists");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedLists.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("blocked by cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: true,
};

module.exports = corsOptions;
