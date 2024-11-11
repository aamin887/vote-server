// services/userService.js
const User = require("../models/User");

// Retrieve a single user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
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
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// Delete a user by ID
const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error("User not found");
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
};
