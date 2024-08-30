const AppError = require("../utils/AppError.utils");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  if (err.name === "instanceError") {
    res.status(statusCode).json({
      name: err.name,
      status: statusCode,
      msg: err.message,
      stack: process.env.NODE_ENV === "development" ? res.stack : null,
    });
  }

  // add custom error messages and codes
  if (err instanceof AppError) {
    res.status(400).send("Hii, again");
  }

  res.status(statusCode).json({
    status: statusCode,
    msg: err?.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;
