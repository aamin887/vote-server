const Token = require("../model/token.model");
const jwt = require("jsonwebtoken");

const {
  createPasswordResetToken,
  verifyPasswordResetToken,
} = require("./token.utils");

// create token for password reset
const passwordResetToken = async function (id, email) {
  let token = await Token.findOne({ userId: id });

  // delete already existed token
  if (token) {
    await Token.deleteOne({ userId: id });
  }

  const resetToken = createPasswordResetToken(id, email);

  await new Token({
    userId: id,
    token: resetToken,
  }).save();

  return resetToken;
};

// verify token for password reset
const verifyPasswordToken = async function ({ token, id }) {
  try {
    const savedToken = await Token.findOne({ userId: id }).lean();

    if (savedToken.token) {
      if (savedToken.activated === true) {
        await Token.deleteOne({ userId: id });
        return "already used";
      }

      let decodedToken = jwt.verify(
        savedToken.token,
        process.env.PASSWORD_RESET_TOKEN_SECRET
      );

      if (decodedToken.id === id) {
        console.log("hihihi>>>>>>>>?????");
        await Token.findOneAndUpdate({ token: token }, { activated: true });
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    // throw new Error(error);
    await Token.deleteOne({ userId: id });
    return "token expired";
    // throw new Error("token expired");
  }
};

module.exports = { passwordResetToken, verifyPasswordToken };
