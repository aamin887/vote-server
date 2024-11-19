const { CustomError } = require("../helpers/CustomError.lib");
const logger = require("../utils/logger.utils");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    const message = `${req.method}\t${req.headers.origin}\t${req.url} : ${err.name} => ${err.message}\n`;
    logger("custom-error.txt", message);
    res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  } else {
    const message = `${req.method}\t${req.headers.origin}\t${req.url}`;
    logger("errors.txt", message);
    res.status(500).json({
      name: err.name,
      status: err.message,
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = errorHandler;
