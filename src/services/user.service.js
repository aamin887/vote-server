const User = require("../model/admin.model");
const { NotFoundError } = require("../helpers/CustomError.lib");

// Retrieve a single user by email
const getUser = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
};

// Retrieve a single user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError();
    return user;
  } catch (error) {
    throw error;
  }
};

// Retrieve all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
};

// Create a new user
const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

// Update a user by ID
const updateUserById = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) throw new NotFoundError();
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Delete a user by ID
const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new NotFoundError();
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUser,
  getUserById,
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
};
