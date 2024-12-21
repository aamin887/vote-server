const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stats", statsSchema);
