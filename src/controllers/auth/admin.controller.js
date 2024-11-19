const asyncHandler = require("express-async-handler");
const path = require("path");
const {
  getAdmin,
  createAdmin,
  updateAdminById,
} = require("../../services/auth/admin.service");
const { createResetToken } = require("../../services/auth/token.service");
const { mailerInstance } = require("../../utils/mailer.utils");
const {
  matchString,
  encryptPassword,
  decryptPassword,
  verifyToken,
  decodeResetTokens,
} = require("../../utils/auth.utils");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../../helpers/CustomError.lib");
const { createToken } = require("../../utils/token.utils");

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

  const checkAdmin = await getAdmin(email);
  if (checkAdmin) {
    throw new ConflictError("User already exist");
  }

  const passwordMatch = matchString(password, confirmPassword);
  if (!passwordMatch) {
    throw new BadRequestError("Passwords do not match");
  }

  const hashedPassword = await encryptPassword(password);

  await createAdmin({
    name,
    email,
    password: hashedPassword,
  });

  await mailerInstance.sendHtmlMail({
    from: "alhassanamin96@gmail.com",
    to: "forkahamin@yahoo.co.uk",
    subject: "Welcome to votes",
    template: path.join(
      __dirname,
      "..",
      "..",
      "templates",
      "welcomeTemplate.hbs"
    ),
    replacements: {
      name: `${name}`,
      username: `${name + "887"}`,
      confirmationLink: "https://vote-client.onrender.com/login",
    },
  });

  res.sendStatus(204);
});

/**
 * @Desc    Login Admin User
 * @Route   POST /api/auth/admin/login
 * @Access  Public
 */
// store refresh token on DB
const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("fill all fields");
  }

  const checkAdmin = await getAdmin(email);
  if (!checkAdmin) {
    throw new NotFoundError("admin not found");
  }

  const decrypt = await decryptPassword(password, checkAdmin.password);

  console.log(decrypt);

  if (!decrypt) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const refreshToken = createToken({
    payload: { id: checkAdmin._id, email },
    secret: process.env.REFRESH_TOKEN_SECRET,
    lifetime: "15s",
  });

  const accessToken = createToken({
    payload: { id: checkAdmin._id, email },
    secret: process.env.ACCESS_TOKEN_SECRET,
    lifetime: "15m",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    priority: "high",
    // domain: ".vote-client.onrender.com",
  });

  res.status(200).json({
    msg: "access granted",
    id: checkAdmin._id,
    email: checkAdmin.email,
    accessToken: accessToken,
  });
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/admins/refresh
 * @Access  Public
 */
// => verify refresh on DB
const refresh = asyncHandler(async function (req, res) {
  const cookies = req?.cookies;

  if (!cookies) return new ForbiddenError("not allowed");
  // if (!cookies) return res.status(403).json({ msg: "forbidden" });

  const refreshToken = req?.cookies?.refresh_token;

  if (refreshToken) {
    const decodedCookie = verifyToken({
      token: refreshToken,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const email = decodedCookie.email;
    const checkAdmin = await getAdmin(email);
    if (!checkAdmin) throw new UnauthorizedError();

    const newAccessToken = createToken({
      payload: {
        id: decodedCookie.id,
        email: decodedCookie.email,
      },
      secret: process.env.ACCESS_TOKEN_SECRET,
      lifetime: "15m",
    });

    res.status(200).json({
      status: "Ok",
      newAccessToken,
      id: decodedCookie.id,
      email: decodedCookie.email,
    });
  } else {
    throw new UnauthorizedError();
  }
});

/**
 * @Desc    Request password reset
 * @Route   POST /api/auth/admin/reset
 * @Access  Public
 */
const passwordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new NotFoundError();
  }

  const admin = await getAdmin(email);
  if (admin) {
    const resetToken = createToken({
      payload: { id: admin._id },
      secret: process.env.PASSWORD_RESET_TOKEN_SECRET,
      lifetime: "10m",
    });

    // const resetToken = await resetTokens.passwordResetToken(user._id);
    // const link = `https://vote-client.onrender.com/password-change/?token=${resetToken}&id=${admin._id}`;

    const link = `http://localhost:5001/auth/admins/reset-password?token=${resetToken}&id=${admin._id}`;

    await createResetToken({ id: admin._id, token: resetToken });

    await mailerInstance.sendHtmlMail({
      from: "alhassanamin96@gmail.com",
      to: "forkahamin@yahoo.co.uk",
      subject: "Password Change Request",
      template: path.join(
        __dirname,
        "..",
        "..",
        "templates",
        "passwordResetTemplate.hbs"
      ),
      replacements: {
        name: `${admin.name}`,
        username: `${admin.name + "887"}`,
        resetLink: link,
      },
    });

    res.sendStatus(204);
  } else {
    throw new BadRequestError();
  }
});

/**
 * @Desc    New password
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const resetPassword = asyncHandler(async function (req, res) {
  const { token, id } = req.query;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    throw new BadRequestError("fill in all fields");
  }

  await decodeResetTokens({ resetToken: token, id });

  if (matchString(password, confirmPassword)) {
    const newPassword = await encryptPassword(password);
    await updateAdminById(id, { password: newPassword });
    res.sendStatus(204);
  }
});

module.exports = {
  register,
  login,
  refresh,
  passwordRequest,
  resetPassword,
};
