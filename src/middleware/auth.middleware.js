const asyncHandler = require("express-async-handler");
const User = require("../model/users.model");
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
      console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(403);
      throw new Error("Not allowed, forbidden");
    }
  }

  if (!accessToken) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = auth;
