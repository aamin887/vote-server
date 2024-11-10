const bcrypt = require("bcrypt");

const hashPassword = async function (password) {
  const passwordSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, passwordSalt);
  return hashedPassword;
};

const decryptPassword = async function (password, hashedPassword) {
  const decrypt = await bcrypt.compare(password, hashedPassword);
  return decrypt;
};

module.exports = {
  hashPassword,
  decryptPassword,
};
