const asyncHandler = require("express-async-handler");
const {
  getByElectionsByCreator,
} = require("../services/api/elections.service");

/**
 * @Desc    General Statistics
 * @Route   DELETE /api/v1/positions/:id
 * @Access  Private
 */
const generalStats = asyncHandler(async function (req, res) {
  const creator = req.user._id;
  const allElections = await getByElectionsByCreator({ creator });

  res.status(200).json({
    elections: allElections?.length,
  });
});

module.exports = {
  generalStats,
};
