const User = require("../../model/user.model");
const Election = require("../../model/election.model");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require("../../helpers/CustomError.lib");

// Retrieve a single user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select(
    "password role verification terms"
  );
  return user;
};

// Retrieve a single user by email
const getUserByEmailAndAdmin = async ({ email, creator }) => {
  const user = await User.findOne({ email, creator }).select("password");
  return user;
};

// Retrieve a single user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new NotFoundError();
  return user;
};

// Retrieve all users
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

// Create a new user
const createUser = async (userData) => {
  const newUser = await User.create(userData);
  if (!newUser) throw new BadRequestError();
  return newUser;
};

// Update a user by ID
const updateUserById = async (userId, updateData) => {
  await getUserById(userId);
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });
  if (!updatedUser) throw new BadRequestError();
  return updatedUser;
};

// Update a user by ID
const updateUserElection = async (userId, election) => {
  await getUserById(userId);

  const updatedUser = await User.updateOne(
    { _id: userId },
    {
      $push: { elections: election },
    }
  );
  await Election.updateOne(
    { _id: election },
    {
      $push: { voters: userId },
    }
  );

  if (!updatedUser) throw new BadRequestError();
  return updatedUser;
};

// find user by username
const checkUserName = async function (userName) {
  const findUser = await User.findOne({ userName });
  return findUser;
};

// Delete a user by ID
const deleteUserById = async (userId) => {
  await getUserById(userId);
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) throw new NotFoundError();
  return deletedUser;
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  updateUserById,
  getUserByEmailAndAdmin,
  deleteUserById,
  checkUserName,
  updateUserElection,
};
