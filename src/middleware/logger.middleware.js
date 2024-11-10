const logger = function (req, res, next) {
  console.log(req.headers.origin);

  next();
};

module.exports = logger;
