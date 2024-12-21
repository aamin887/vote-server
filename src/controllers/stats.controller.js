const asyncHandler = require("express-async-handler");
const {
  getByElectionsByCreator,
} = require("../services/api/elections.service");

const Election = require("../model/election.model");
const Candidate = require("../model/candidates.model");
const User = require("../model/user.model");

/**
 * @Desc    General Statistics
 * @Route   DELETE /api/v1/positions/:id
 * @Access  Private
 */
const generalStats = asyncHandler(async function (req, res) {
  const creator = req.user._id;
  const elections = await Election.countDocuments({ creator });
  const voters = await User.countDocuments({ creator });
  const candidates = await Candidate.countDocuments({ creator });

  res.status(200).json({
    elections: elections,
    voters: voters,
    candidates: candidates,
  });
});

module.exports = {
  generalStats,
};
