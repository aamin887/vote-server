const asyncHandler = require("express-async-handler");
const Election = require("../model/election.model");
const Candidate = require("../model/candidates.model");
const Position = require("../model/position.model");

const {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  ValidationError,
} = require("../helpers/CustomError.lib");

// casting a vote
const castVote = asyncHandler(async function (req, res) {
  const voter = req.user._id;
  const { electionId, candidateId } = req.params;

  const findElection = await Election.findById(electionId);
  if (!findElection.voters.includes(voter)) {
    throw new UnauthorizedError();
  }

  const findCandidate = await Candidate.findById(candidateId);
  if (findElection.voters.includes(findCandidate.position)) {
    throw new ForbiddenError();
  }

  if (
    findCandidate.votes.includes(voter) &&
    findElection.voted.includes(voter)
  ) {
    throw new ForbiddenError("Already voted");
  }

  await Candidate.updateOne(
    { _id: candidateId },
    { $inc: { voteCount: 1 }, $push: { votes: voter } } // Increment operation
  );

  await Election.updateOne({ _id: electionId }, { $push: { voted: voter } });

  await Position.updateOne(
    { _id: findCandidate.position },
    { $push: { voters: voter } }
  );

  res.sendStatus(200);
});

module.exports = {
  castVote,
};
