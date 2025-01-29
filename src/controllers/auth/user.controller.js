const asyncHandler = require("express-async-handler");
const path = require("path");
const User = require("../../model/user.model");
const Token = require("../../model/token.model");
const {
  createUser,
  getUserById,
  updateUserById,
  getUserByEmail,
  getUserByEmailAndAdmin,
  checkUserName,
} = require("../../services/auth/user.service");
const {
  getResetToken,
  deleteResetToken,
  updateResetToken,
} = require("../../services/auth/token.service");
const { mailerInstance } = require("../../utils/mailer.utils");
const {
  matchString,
  encryptPassword,
  decryptPassword,
  decodeResetTokens,
  verifyToken,
  createToken,
} = require("../../utils/auth.utils");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} = require("../../helpers/CustomError.lib");
const { createResetToken } = require("../../services/auth/token.service");
const UsernameGenerator = require("../../helpers/CustomUserName");

/**
 * @Desc    Register User
 * @Route   POST /api/auth/user/register
 * @Access  Public
 */
const register = asyncHandler(async function (req, res) {
  let userName;
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    throw new BadRequestError("fill all fields");
  }

  let checkUser = await getUserByEmail(email);
  const generateUserName = new UsernameGenerator();
  userName = await generateUserName.generateUsername(email.trim());

  while (await checkUserName(userName)) {
    userName = await generateUserName.generateUsername(email);
  }

  if (checkUser) {
    if (checkUser?.verification === false) {
      const token = createToken({
        payload: { user: checkUser._id },
        secret: process.env.ACCESS_TOKEN_SECRET,
        lifetime: "10y",
      });

      const link = `${process.env.CLIENT_URL}/verification?token=${token}`;
      // create a token to be verified by the user when the client

      await mailerInstance.sendHtmlMail({
        from: "alhassanamin96@gmail.com",
        to: email,
        subject: "Welcome to votes",
        template: path.join(__dirname, "..", "..", "templates", "welcome.hbs"),
        replacements: {
          username: `${checkUser?.userName}`,
          confirmationLink: link,
        },
      });
      throw new ConflictError(
        "email already registered, check your inbox to verify."
      );
    }

    throw new ConflictError(
      "This username is already taken. Please choose a different one."
    );
  }

  const passwordMatch = matchString(password, confirmPassword);
  if (!passwordMatch) {
    throw new ValidationError("Passwords do not match");
  }
  const hashedPassword = await encryptPassword(password);
  const user = await createUser({
    email,
    userName,
    password: hashedPassword,
  });

  const token = createToken({
    payload: { user: user._id },
    secret: process.env.ACCESS_TOKEN_SECRET,
    lifetime: "10y",
  });

  const link = `${process.env.CLIENT_URL}/verification?token=${token}`;
  // create a token to be verified by the user when the client

  await mailerInstance.sendHtmlMail({
    from: "alhassanamin96@gmail.com",
    to: email,
    subject: "Welcome to votes",
    template: path.join(__dirname, "..", "..", "templates", "welcome.hbs"),
    replacements: {
      username: `${userName}`,
      confirmationLink: link,
    },
  });

  res.sendStatus(201);
});

/**
 * @Desc    Login User
 * @Route   POST /api/auth/user/login
 * @Access  Public
 */
const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("fill all fields");
  }

  const checkUser = await getUserByEmail(email);
  if (checkUser.verification === false) {
    throw new ForbiddenError(
      "Your account is not verified. Please verify your email."
    );
  }

  if (!checkUser) {
    throw new UnauthorizedError("User does not exist");
  }

  await getUserById(checkUser._id);
  const decrypt = await decryptPassword(password, checkUser.password);
  if (!decrypt) {
    throw new UnauthorizedError("invalid email or password");
  }

  await User.findByIdAndUpdate(
    checkUser._id,
    { lastLogin: new Date() },
    { timestamps: false }
  );

  const refreshToken = createToken({
    payload: { id: checkUser._id, email },
    secret: process.env.REFRESH_TOKEN_SECRET,
    lifetime: "1d",
  });
  const accessToken = createToken({
    payload: {
      id: checkUser._id,
      email,
    },
    secret: process.env.ACCESS_TOKEN_SECRET,
    lifetime: "30d",
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
    id: checkUser._id,
    email: checkUser.email,
    terms: checkUser?.terms,
    accessToken: accessToken,
  });
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/users/refresh
 * @Access  Public
 */
const refresh = asyncHandler(async function (req, res) {
  const cookies = req?.cookies;

  if (!cookies) return new ForbiddenError("not allowed");
  const refreshToken = req?.cookies?.refresh_token;
  if (refreshToken) {
    const decodedCookie = verifyToken({
      token: refreshToken,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const email = decodedCookie.email;
    const checkUser = await getUserByEmail(email);
    if (!checkUser) throw new UnauthorizedError();

    const newAccessToken = createToken({
      payload: {
        id: decodedCookie.id,
        email: decodedCookie.email,
        terms: decodedCookie?.terms,
      },
      secret: process.env.ACCESS_TOKEN_SECRET,
      lifetime: "15m",
    });

    res.status(200).json({
      status: "Ok",
      newAccessToken,
      id: decodedCookie.id,
      email: decodedCookie.email,
      terms: decodedCookie.terms,
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
    throw new BadRequestError("enter your email");
  }

  const user = await getUserByEmail(email);

  if (user) {
    const findToken = await Token.findOne({
      user: user._id,
    });

    if (findToken) {
      await Token.findByIdAndDelete(findToken._id);
    }

    const resetToken = createToken({
      payload: { id: user._id },
      secret: process.env.PASSWORD_RESET_TOKEN_SECRET,
      lifetime: "15m",
    });

    const link = `${process.env.CLIENT_URL}/new-password?token=${resetToken}&id=${user._id}`;
    await createResetToken({ id: user._id, token: resetToken });

    await mailerInstance.sendHtmlMail({
      from: "alhassanamin96@gmail.com",
      to: email,
      subject: "Password Change Request",
      template: path.join(__dirname, "..", "..", "templates", "password.hbs"),
      replacements: {
        name: `${user?.fullName}`,
        username: `${user?.userName}`,
        resetLink: link,
      },
    });

    res.sendStatus(201);
  } else {
    throw new UnauthorizedError();
  }
});

/**
 * @Desc    New password
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const resetPassword = asyncHandler(async function (req, res) {
  const { token, id } = req.query;

  const { newPassword, confirmNewPassword } = req.body;
  if (!newPassword || !confirmNewPassword) {
    throw new BadRequestError("fill in all fields");
  }

  if (matchString(newPassword, confirmNewPassword)) {
    const password = await encryptPassword(newPassword);
    await updateUserById(id, { password });
    // send email to tell user about new password
    res.status(200).json({ token });
  }

  const storedToken = await Token.findOneAndUpdate(
    { user: id },
    { activated: true }
  );

  console.log(await Token.findOne({ user: id }));
});

/**
 * @Desc    Verify user
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const verify = asyncHandler(async function (req, res) {
  const { token } = req.query;
  const decodedToken = verifyToken({
    token,
    secret: process.env.ACCESS_TOKEN_SECRET,
  });

  if (!decodedToken) {
    throw new BadRequestError();
  }

  const findUser = await getUserById(decodedToken.user);
  if (findUser.verification) {
    throw new ConflictError("user already validated");
  }
  const updatedUser = await updateUserById(decodedToken.user, {
    verification: true,
  });
  res.status(200).json(updatedUser);
});

/**
 * @Desc    Verify user
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const profile = asyncHandler(async function (req, res) {
  const { userId } = req.params;
  const findUser = await getUserById(userId);
  res.status(200).json(findUser);
});

/**
 * @Desc    Verify user
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const updateProfile = asyncHandler(async function (req, res) {
  const { userId } = req.params;
  const updateData = req.body;
  await updateUserById(userId, updateData);
  res.sendStatus(204);
});

/**
 * @Desc    Verify voter
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const verifyVoter = asyncHandler(async function (req, res) {
  const { userId } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword);

  if (!password || !confirmPassword) {
    throw new BadRequestError("fill all fields");
  }
  if (!matchString(password, confirmPassword)) {
    throw new BadRequestError("password do not match");
  }

  const findUser = await getUserById(userId);
  if (findUser.verification === true) {
    throw new ForbiddenError();
  }

  if (findUser.role !== "VOTER") {
    throw new UnauthorizedError("not allowed");
  }

  const hashedPassword = await encryptPassword(password);
  const updateData = { password: hashedPassword, verification: true };
  const updatedUser = await updateUserById(userId, updateData);
  res.status(200).json(updatedUser);
});

/**
 * @Desc    Get voters
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const voters = asyncHandler(function (req, res) {
  const creator = req?.user?._id;
  res.status(200).json(creator);
});

/**
 * @Desc    Verify voter
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const checkToken = asyncHandler(async function (req, res) {
  const { token } = req.query;

  const decodedToken = verifyToken({
    token: token,
    secret: process.env.PASSWORD_RESET_TOKEN_SECRET,
  });
  if (!decodedToken) throw new ValidationError();

  const findToken = await Token.findOne({
    user: decodedToken.id,
  });
  if (!findToken) throw new ValidationError();
  console.log(findToken);

  if (findToken.activated === true) {
    await Token.findByIdAndDelete(findToken._id);
    throw new UnauthorizedError();
  }

  res.sendStatus(204);
});

/**
 * @Desc    Verify voter
 * @Route   POST /api/auth/new-password
 * @Access  Public
 */
const logout = asyncHandler(function (req, res) {
  const cookies = req?.cookies;

  if (!cookies) return res.sendStatus(204);

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return res.status(200).json({
    message: "refresh cookie cleared",
  });
});

module.exports = {
  register,
  login,
  refresh,
  passwordRequest,
  resetPassword,
  verify,
  verifyVoter,
  profile,
  updateProfile,
  voters,
  logout,
  checkToken,
};
