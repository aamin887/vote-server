const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  manifesto: {
    type: String,
    default: "",
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  photoUrl: {
    type: String,
  },
  photoId: {
    type: String,
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
    required: true,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
