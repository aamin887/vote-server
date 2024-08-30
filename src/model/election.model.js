const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  electionName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Election", electionSchema);
