const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
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

module.exports = new model("Tokens", tokenSchema);
