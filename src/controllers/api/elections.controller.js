const asyncHandler = require("express-async-handler");
const { newElection } = require("../../services/api/elections.service");
const {
  NotFoundError,
  BadRequestError,
} = require("../../helpers/CustomError.lib");

/**
 * @Desc    Create an election
 * @Route   POST /v1/elections
 * @Access  PRIVATE
 */
const createElection = asyncHandler(async function (req, res) {
  const { electionName, description, startDate, endDate, organisation } =
    req.body;

  if (
    !electionName ||
    !description ||
    !startDate ||
    !endDate ||
    !organisation
  ) {
    res.status(400);
    throw new BadRequestError("fill all fields");
  }
});

module.exports = {
  createElection,
};
