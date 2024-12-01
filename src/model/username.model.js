const { Schema, model } = require("mongoose");

const usernameSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
});

module.exports = new model("username", usernameSchema);
