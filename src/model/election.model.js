const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    },
  ],
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  voted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posterId: {
    type: String,
    default: "",
  },
  posterUrl: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "cancelled", "active"],
    required: true,
  },
});

module.exports = mongoose.model("Election", electionSchema);
