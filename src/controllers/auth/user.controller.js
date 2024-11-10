const asyncHandler = require("express-async-handler");
const Admin = require("../../model/admin.model");

/**
 * @Desc    Register Admin User
 * @Route   POST /api/auth/admin/register
 * @Access  Public
 */
const register = asyncHandler(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;

  // business login => service/auth/admin

  res.send(name);
});

/**
 * @Desc    Register Admin User
 * @Route   POST /api/auth/admin/register
 * @Access  Public
 */
const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  // business login => service/auth/admin

  res.send(email);
});

module.exports = {
  register,
  login,
};
