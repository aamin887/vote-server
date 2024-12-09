const { Schema, model } = require("mongoose");

const voterSchema = new Schema({
  electionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = new model("Voter", voterSchema);
