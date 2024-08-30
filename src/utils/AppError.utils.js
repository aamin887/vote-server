class AppError extends Error {
  constructor(errCode, message, errStatus) {
    super(message);
    this.message = message;
    this.errCode = errCode;
    this.errStatus = errStatus;
  }
}

module.exports = AppError;
