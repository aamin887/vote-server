const AppError = require("../utils/AppError.utils");
const { CustomError } = require("../lib/CustomError.lib");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
      ...(err.errors && { errors: err.errors }),
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = errorHandler;
