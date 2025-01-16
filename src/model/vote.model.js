const { Schema, model } = require("mongoose");

const voterSchema = new Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Election",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = new model("Vote", voterSchema);
