const asyncHandler = require("express-async-handler");
const Election = require("../../model/election.model");
const path = require("path");
// services
const {
  getElectionByNameAndCreator,
  createNewElection,
  updateAnElection,
  getElectionById,
  deleteAnElection,
  getByElectionByCreatorAndId,
} = require("../../services/api/elections.service");
const {
  createUser,
  getUserByEmail,
  getUserByEmailAndAdmin,
  checkUserName,
  updateUserById,
  updateUserElection,
} = require("../../services/auth/user.service");
// error classes
const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} = require("../../helpers/CustomError.lib");

const User = require("../../model/user.model");
const UsernameGenerator = require("../../helpers/CustomUserName");
const { mailerInstance } = require("../../utils/mailer.utils");

const {
  matchString,
  encryptPassword,
  createToken,
} = require("../../utils/auth.utils");

/**
 * @Desc    Create an election
 * @Route   POST /v1/elections
 * @Access  PRIVATE
 */
const createElection = asyncHandler(async function (req, res) {
  const { name, description, startDate, endDate } = req.body;
  const creator = req.user._id;

  if (!name || !description || !startDate || !endDate) {
    res.status(400);
    throw new BadRequestError("fill all fields");
  }

  const checkForElection = await getElectionByNameAndCreator({
    name,
    creator,
  });
  if (checkForElection) {
    throw new ConflictError("election already exist with this name");
  }

  const formData = {
    name,
    description,
    startDate,
    endDate,
    creator,
  };
  const newElection = await createNewElection({ formData });
  if (newElection) return res.status(201).json(newElection);

  throw new InternalServerError();
});

/**
 * @Desc    Retrieve one election
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getElection = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  const elections = await getByElectionByCreatorAndId({ id, creator });
  if (elections) return res.status(200).json(elections);
  throw new InternalServerError();
});

/**
 * @Desc    Retrieve all elections
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getAllElections = asyncHandler(async function (req, res) {
  const elections = res.paginatedResults;
  console.log(elections);
  if (elections) return res.status(200).json(elections);
});

/**
 * @Desc    uodate an election
 * @Route   PUT /v1/elections
 * @Access  PRIVATE
 */
const updateElections = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const formData = req.body;
  const id = req.params?.id;

  const updatedElection = await updateAnElection({ id, creator, formData });
  if (updatedElection) return res.status(200).json(updatedElection);
  throw new InternalServerError();
});

/**
 * @Desc    Delete an election
 * @Route   DELETE /v1/elections
 * @Access  PRIVATE
 */
const deleteElections = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  if (await deleteAnElection({ id, creator })) return res.sendStatus(204);
  throw new InternalServerError();
});

/**
 * @Desc    Delete an election
 * @Route   DELETE /v1/elections
 * @Access  PRIVATE
 */
const getVoters = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;
  const findVoters = await User.find({
    creator: creator,
    elections: id,
  }).select("-password");

  res.status(200).json(findVoters);
});

/**
 * @Desc    Register an election
 * @Route   POST /v1/elections
 * @Access  PRIVATE
 */
const registerVoters = asyncHandler(async function (req, res) {
  const { fullName, email, password, confirmPassword } = req.body;
  const admin = req?.user?._id;
  const { id: election } = req.params;

  if (!fullName || !email || !password || !confirmPassword) {
    throw new BadRequestError("fill all fields");
  }

  const findElection = await getElectionById(election);
  if (!findElection) {
    throw new NotFoundError();
  }

  // if user already exist user add elections
  let checkUser = await getUserByEmail(email);
  if (checkUser) {
    const checkElection = await User.findOne({
      _id: checkUser._id,
      elections: { $in: election },
    });

    console.log(checkElection, "Amin");

    if (checkElection) {
      throw new ConflictError();
    }
    await updateUserElection(checkUser._id, election);
    // email to user
    return res.sendStatus(201);
  }

  // if new user
  let userName;
  const generateUserName = new UsernameGenerator();
  userName = await generateUserName.generateUsername(email.trim());

  while (await checkUserName(userName)) {
    userName = await generateUserName.generateUsername(email);
  }

  checkUser = await getUserByEmailAndAdmin({ email, creator: admin });
  const passwordMatch = matchString(password, confirmPassword);
  if (!passwordMatch) {
    throw new ValidationError("Passwords do not match");
  }
  const hashedPassword = await encryptPassword(password);

  const user = await createUser({
    fullName,
    email,
    userName,
    password: hashedPassword,
    role: "VOTER",
    creator: req?.user?._id.toString(),
    elections: [election.toString()],
  });

  await Election.updateOne(
    { _id: election },
    {
      $push: { voters: user._id },
    }
  );

  const token = createToken({
    payload: { user: user._id },
    secret: process.env.ACCESS_TOKEN_SECRET,
    lifetime: "10y",
  });

  const link = `http://localhost:5173/verification?token=${token}`;
  // create a token to be verified by the user when the client

  await mailerInstance.sendHtmlMail({
    from: "alhassanamin96@gmail.com",
    to: email,
    subject: "Welcome to votes",
    template: path.join(
      __dirname,
      "..",
      "..",
      "templates",
      "welcomeTemplate.hbs"
    ),
    replacements: {
      name: `${fullName}`,
      username: `${fullName + "887"}`,
      confirmationLink: link,
    },
  });

  res.sendStatus(201);
});

module.exports = {
  createElection,
  getElection,
  getAllElections,
  updateElections,
  deleteElections,
  getVoters,
  registerVoters,
};
