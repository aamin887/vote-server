const User = require("../../model/user.model");
const {
  NotFoundError,
  BadRequestError,
} = require("../../helpers/CustomError.lib");

// Retrieve a single user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("password");
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
  const newUser = new User(userData);
  await newUser.save();
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
  deleteUserById,
};
