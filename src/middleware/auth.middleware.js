const asyncHandler = require("express-async-handler");
const {
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
} = require("../helpers/CustomError.lib");
const User = require("../model/user.model");
const token = require("../utils/token.utils");
const roles = require("../config/roles.json");

const auth = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];

    try {
      const decoded = token.verifyAccessToken(accessToken);
      const user = await User.findById(decoded.id).select("-password");

      if (user.verification === true) {
        req.user = user;
        next();
      }
    } catch (error) {
      throw new ForbiddenError("sss");
    }
  }

  if (!accessToken) {
    throw new UnauthorizedError();
  }
});

module.exports = auth;
