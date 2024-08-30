require("dotenv").config();
const jwt = require("jsonwebtoken");

const createAccessToken = function ({ id, email }) {
  return jwt.sign({ id: id, email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15min",
  });
};

const createRefreshToken = function ({ id, email }) {
  return jwt.sign({ id: id, email: email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createPasswordResetToken = function (id, email) {
  return jwt.sign(
    { id: id, email: email },
    process.env.PASSWORD_RESET_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
};

const verifyAccessToken = function (token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const verifyPasswordResetToken = function (token) {
  return jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET);
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createPasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
};
