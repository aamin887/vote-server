const asyncHandler = require("express-async-handler");
const User = require("../model/user.model");
const token = require("../utils/token.utils");

const auth = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];

    try {
      const decoded = token.verifyAccessToken(accessToken);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  }

  if (!accessToken) {
    res.sendStatus(401);
  }
});

module.exports = auth;
