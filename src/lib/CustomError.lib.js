const errorCodes = require("../config/errorCodes.json");

class CustomError extends Error {
  constructor(errorKey, customMessage) {
    const { code, message } =
      errorCodes[errorKey] || errorCodes.INTERNAL_SERVER_ERROR;
    super(customMessage || message);
    this.name = this.constructor.name;
    this.statusCode = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(customMessage) {
    super("BAD_REQUEST", customMessage);
  }
}

class NotFoundError extends CustomError {
  constructor(customMessage) {
    super("NOT_FOUND", customMessage);
  }
}

class UnauthorizedError extends CustomError {
  constructor(customMessage) {
    super("UNAUTHORIZED", customMessage);
  }
}

class ForbiddenError extends CustomError {
  constructor(customMessage) {
    super("FORBIDDEN", customMessage);
  }
}

class ValidationError extends CustomError {
  constructor(errors = []) {
    super("VALIDATION_ERROR", "Validation Error");
    this.errors = errors; // for detailed field-level errors
  }
}
module.exports = {
  CustomError,
  NotFoundError,
  BadRequestError,
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
};
