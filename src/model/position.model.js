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
});

module.exports = mongoose.model("Position", positionSchema);
