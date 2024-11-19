const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger.utils");

class Limiter {
  constructor({ timeAllowed, maxTries, message, fileName }) {
    this.rateLimit = rateLimit({
      windowMs: timeAllowed,
      max: maxTries,
      message: {
        message:
          message ||
          `Too many login attempts from this IP, please try again after a ${timeAllowed} second pause`,
      },
      handler: (req, res, next, options) => {
        logger(
          fileName,
          `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
        );
        res.status(options.statusCode).send(options.message);
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
  }
}

module.exports = Limiter;
