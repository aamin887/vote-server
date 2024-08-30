const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema(
  {
    license: {
      type: number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("License", licenseSchema);
