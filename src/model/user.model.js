const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    terms: {
      type: Boolean,
      default: false,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "ADMIN",
      enum: ["ADMIN", "VOTER"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
