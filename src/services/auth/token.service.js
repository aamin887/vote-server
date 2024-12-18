const Token = require("../../model/token.model");
const {
  NotFoundError,
  UnauthorizedError,
} = require("../../helpers/CustomError.lib");

const getResetToken = async function ({ token }) {
  try {
    const storedToken = await Token.findOne({ token }).lean();
    return storedToken;
  } catch (error) {
    throw new NotFoundError();
  }
};

// create reset token
const createResetToken = async function ({ id, token }) {
  const findToken = await getResetToken({ token });
  if (findToken) {
    await Token.deleteOne({ token });
  }
  const newToken = new Token({ user: id, token: token });
  await newToken.save();
  return newToken;
};

const updateResetToken = async function ({ tokenId, updateData }) {
  try {
    const updatedToken = await Token.findByIdAndUpdate(tokenId, updateData, {
      new: true,
    });
    if (!updatedToken) throw new Error(" not found");
  } catch (error) {
    throw new NotFoundError();
  }
};
const deleteResetToken = async function (id) {
  try {
    const deletedToken = await Token.findByIdAndDelete(id);
    if (!deletedToken) throw new UnauthorizedError();
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
