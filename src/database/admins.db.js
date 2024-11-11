// services/userService.js
const Admin = require("../model/admin.model");
const { NotFoundError } = require("../helpers/CustomError.lib");

// Retrieve a single user by ID
const getAdmin = async (email) => {
  try {
    const admin = await Admin.findOne({ email });
    // if (!admin) throw new NotFoundError("User not found");
    return admin;
  } catch (error) {
    throw error;
  }
};
// Retrieve a single user by ID
const getAdminById = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new NotFoundError("User not found");
    return admin;
  } catch (error) {
    throw error;
  }
};

// Retrieve all users
const getAllAdmins = async () => {
  try {
    const admins = await Admin.find();
    return admins;
  } catch (error) {
    throw error;
  }
};

// Create a new user
const createAdmin = async (adminData) => {
  try {
    const newAdmin = new Admin(adminData);
    await newAdmin.save();
    return newAdmin;
  } catch (error) {
    throw error;
  }
};

// Update a user by ID
const updateAdminById = async (adminId, updateData) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
    });
    if (!updatedAdmin) throw new Error("User not found");
    return updatedAdmin;
  } catch (error) {
    throw error;
  }
};

// Delete a user by ID
const deleteAdminById = async (adminId) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) throw new Error("User not found");
    return deletedAdmin;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAdmin,
  getAdminById,
  getAllAdmins,
  createAdmin,
  updateAdminById,
  deleteAdminById,
};
