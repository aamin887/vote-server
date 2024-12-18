const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
