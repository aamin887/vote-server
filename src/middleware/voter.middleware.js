const asyncHandler = require("express-async-handler");
const {
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
} = require("../helpers/CustomError.lib");
const User = require("../model/user.model");
const token = require("../utils/token.utils");

const voterAuth = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];

    const decoded = token.verifyAccessToken(accessToken);

    if (!decoded) {
      throw new ForbiddenError();
    }

    const user = await User.findById(decoded.id).select("-password");
    console.log(user);

    if (user.verification === true && user.role === "VOTER") {
      req.user = user;
      return next();
    }

    if (user.verification === false) {
      throw new ValidationError("user account to verified");
    }

    throw new ForbiddenError("");
  }

  if (!accessToken) {
    throw new UnauthorizedError();
  }
});

module.exports = voterAuth;
