const fsPromise = require("fs").promises;

const logger = function (req, res, next) {
  console.log("testing logger");
};

module.exports = logger;
