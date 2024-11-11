const logger = require("../utils/logger.utils");

const loggerMiddleware = (logfile) => (req, res, next) => {
  // req.time = new Date(Date.now()).toString();
  // console.log(req.method, req.hostname, req.path, req.time, res.statusCode); => for reference
  const message = `${req.method}\t${req.headers.origin}\t${req.url}`;
  logger(logfile, message);

  next();
};

module.exports = loggerMiddleware;
