const fsPromise = require("fs").promises;

const logger = function (log, logFile) {
  console.log(req.method);

  // req.time = new Date(Date.now()).toString();
  // console.log(req.method, req.hostname, req.path, req.time, res.statusCode);

  console.log("testing logger");
};

module.exports = logger;
