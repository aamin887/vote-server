const fsPromise = require("fs").promises;

const logger = function (req, res, next) {
  console.log(req.method);

  req.time = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, req.time, res.statusCode);

  console.log("testing logger");
  next();
};

module.exports = logger;
