const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Users",
  },
  token: {
    type: String,
    require: true,
  },
  activated: {
    type: Boolean,
    default: false,
  },
});

module.exports = new model("Token", tokenSchema);
