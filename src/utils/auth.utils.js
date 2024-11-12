const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../model/token.model");
const {
  getResetToken,
  updateResetToken,
  deleteResetToken,
} = require("../services/token.service");
const { ForbiddenError } = require("../helpers/CustomError.lib");

// encrypt password
const encryptPassword = async function (password) {
  const passwordSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, passwordSalt);
  return hashedPassword;
};

// decrypt password
const decryptPassword = async function (password, hashedPassword) {
  const decrypt = await bcrypt.compare(password, hashedPassword);
  return decrypt;
};

const matchString = function (stringOne, stringTwo) {
  return stringOne.toString() === stringTwo.toString();
};

// create token
const createToken = function ({ payload, secret, lifetime = null }) {
  try {
    const token = jwt.sign({ ...payload }, secret, {
      expiresIn: lifetime || "1d",
    });
    return token;
  } catch (error) {
    throw error;
  }
};

// verify/decode token
const verifyToken = function ({ token, secret }) {
  return jwt.verify(token, secret);
};

// create unique IDs
const generateUUID = function () {
  const bytes = randomBytes(16);
  // Set version (4) and variant bits according to the UUID v4 specification
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Set version to 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Set variant to 10

  // Format bytes as a UUID string
  return [
    bytes.toString("hex", 0, 4),
    bytes.toString("hex", 4, 6),
    bytes.toString("hex", 6, 8),
    bytes.toString("hex", 8, 10),
    bytes.toString("hex", 10, 16),
  ].join("-");
  // Example output: '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
};

// verify password reset tokens
// verify token for password reset
const decodeResetTokens = async function ({ resetToken, id }) {
  try {
    const { _id, token, activated } = await getResetToken({
      token: resetToken,
    });
    if (activated) {
      await deleteResetToken({ id: _id });
      throw new ForbiddenError();
    }

    const decoded = verifyToken({
      token,
      secret: process.env.PASSWORD_RESET_TOKEN_SECRET,
    });
    if (decoded.id === id) {
      await updateResetToken({ tokenId: _id, updateData: { activated: true } });
    }
  } catch (error) {
    await deleteResetToken({ id: id });
    throw new ForbiddenError();
  }
};

module.exports = {
  encryptPassword,
  decryptPassword,
  matchString,
  createToken,
  verifyToken,
  generateUUID,
  decodeResetTokens,
};
