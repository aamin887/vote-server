const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    accessCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    terms: {
      type: Boolean,
      default: false,
    },
    verification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admins", userSchema);
