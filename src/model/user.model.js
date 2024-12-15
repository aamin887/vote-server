const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      minLength: 4,
      required: [true, "Username is required"],
    },
    fullName: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (this.role === "VOTER") {
            return !!value; // Ensure name exists when role is "VOTER"
          }
          return true; // No validation needed for other roles
        },
        message: "Name is required for VOTER role",
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      required: [true, "Password is required"],
    },
    terms: {
      type: Boolean,
      default: false,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    elections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        validate: {
          validator: function (value) {
            if (this.role === "VOTER") {
              return !!value;
            }
            return true; // No validation needed for other roles
          },
          message: "Election ID is required for the VOTER role",
        },
      },
    ],
    role: {
      type: String,
      default: "ADMIN",
      enum: ["ADMIN", "VOTER"],
      required: [true, "Role is required"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (value) {
          if (this.role === "VOTER") {
            return !!value; // Ensure creatorId exists when role is "VOTER"
          }
          return true; // No validation needed for other roles
        },
        message: "Creator ID is required for VOTER role",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
