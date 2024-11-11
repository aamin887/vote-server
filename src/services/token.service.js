const Token = require("../model/token.model");
const { createToken } = require("../utils/auth.utils");

const getResetToken = async function ({ token }) {
  try {
    const storedToken = await Token.findOne({ token });
    return storedToken;
  } catch (error) {
    throw error;
  }
};

// create reset token
const createResetToken = async function ({ id, token }) {
  const findToken = await getResetToken({ token });
  if (findToken) {
    await Token.deleteOne({ token });
  }

  try {
    const newToken = new Token({ user: id, token: token });
    await newToken.save();
    return newToken;
  } catch (error) {
    throw error;
  }
};
const updateResetToken = async function ({ token, updateData }) {
  try {
    const updatedToken = await Token.findByIdAndUpdate(token, updateData, {
      new: true,
    });
    if (!updatedToken) throw new Error(" not found");
  } catch (error) {
    throw error;
  }
};
const deleteResetToken = async function () {
  try {
    const deletedToken = await Token.findByIdAndDelete(userId);
    if (!deletedToken) throw new Error("User not found");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getResetToken,
  createResetToken,
  updateResetToken,
  deleteResetToken,
};
