const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
    },
  ],
});

module.exports = mongoose.model("Position", positionSchema);
