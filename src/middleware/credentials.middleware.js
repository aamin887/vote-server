const allowedLists = require("../config/allowedLists");

const credentials = function (req, res, next) {
  const origin = req.headers.origin;

  if (allowedLists.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
