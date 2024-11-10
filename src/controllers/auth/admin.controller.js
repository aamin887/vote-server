const asyncHandler = require("express-async-handler");
const { registerAdmin } = require("../../services/user.service");
const { mailerInstance } = require("../../utils/mailer.utils");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require("../../helpers/CustomError.lib");

/**
 * @Desc    Register Admin User
 * @Route   POST /api/auth/admin/register
 * @Access  Public
 */
const register = asyncHandler(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new BadRequestError("fill all fields");
  }

  const checkAdmin = await registerAdmin(email);
  if (checkAdmin) {
    throw new ConflictError("User already exist");
  }

  const info = await mailerInstance.sendTextMail({
    from: "alhassanamin96@gmail.com",
    to: "forkahamin@yahoo.co.uk",
    subject: "message",
    text: "<h1>Hello</h1>",
  });

  res.send(info);
});

/**
 * @Desc    Login Admin User
 * @Route   POST /api/auth/admin/login
 * @Access  Public
 */
const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  // business login => service/auth/admin

  res.send({ email, password });
});

module.exports = {
  register,
  login,
};
