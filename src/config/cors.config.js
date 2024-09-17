const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
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
