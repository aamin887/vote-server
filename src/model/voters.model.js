const { model, Schema } = require("mongoose");

// TODO: add a name field
//  => {name: String, requiredL true}
// TODO: add a role field
// => role: { type: String, enum: ['admin', 'voter'], required: true }
// => organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },

const voterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uniqueNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    acceptTerms: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Voters", voterSchema);
