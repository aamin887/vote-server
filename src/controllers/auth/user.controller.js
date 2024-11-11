const asyncHandler = require("express-async-handler");
const path = require("path");
const { getUser, createUser } = require("../../services/user.service");
const { mailerInstance } = require("../../utils/mailer.utils");
const {
  matchString,
  encryptPassword,
  decryptPassword,
  verifyToken,
} = require("../../utils/auth.utils");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} = require("../../helpers/CustomError.lib");
const { createToken } = require("../../utils/token.utils");

/**
 * @Desc    Register User
 * @Route   POST /api/auth/user/register
 * @Access  Public
 */
const register = asyncHandler(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    throw new BadRequestError("fill all fields");
  }

  const checkAdmin = await getUser(email);
  if (checkAdmin) {
    throw new ConflictError("User already exist");
  }

  const passwordMatch = matchString(password, confirmPassword);
  if (!passwordMatch) {
    throw new BadRequestError("Passwords do not match");
  }

  const hashedPassword = await encryptPassword(password);

  await createUser({
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
 * @Desc    Login User
 * @Route   POST /api/auth/user/login
 * @Access  Public
 */
const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("fill all fields");
  }

  const checkUser = await getUser(email);
  if (!checkUser) {
    throw new BadRequestError();
  }

  const decrypt = await decryptPassword(password, checkUser.password);

  console.log(decrypt);

  if (!decrypt) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const refreshToken = createToken({
    payload: { id: checkUser._id, email },
    secret: process.env.REFRESH_TOKEN_SECRET,
    lifetime: "1d",
  });

  const accessToken = createToken({
    payload: { id: checkUser._id, email },
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
    id: checkUser._id,
    email: checkUser.email,
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
  // if (!cookies) return res.status(403).json({ msg: "forbidden" });

  const refreshToken = req?.cookies?.refresh_token;

  if (refreshToken) {
    const decodedCookie = verifyToken({
      token: refreshToken,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const email = decodedCookie.email;
    const checkUser = await getUser(email);
    if (!checkUser) throw new UnauthorizedError();

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

module.exports = {
  register,
  login,
  refresh,
};
