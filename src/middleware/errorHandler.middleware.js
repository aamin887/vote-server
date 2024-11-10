const { CustomError } = require("../helpers/CustomError.lib");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  } else {
    res.status(500).json({
      name: err.name,
      status: err.message,
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = errorHandler;
