const mongoose = require("mongoose");
// mongoose.models = {};

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      // minLength: 6,
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

module.exports = mongoose.model("Users", userSchema);
