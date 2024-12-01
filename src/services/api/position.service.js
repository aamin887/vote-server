const Position = require("../../model/position.model");
const Election = require("../../model/election.model");
const Candidate = require("../../model/candidates.model");
const {
  getElectionById,
  updateAnElectionById,
} = require("./elections.service");

const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ConflictError,
} = require("../../helpers/CustomError.lib");

// get an election using id
const getAllPositions = async function (election) {
  const position = await Position.find({ election });
  return position;
};

// get an election using id
const getPositionById = async function (id) {
  const position = await Position.findById(id).exec();
  if (!position) {
    throw new NotFoundError("position not found");
  }
  return position;
};

// create a new election
const createNewPosition = async function (formData) {
  const { election, position } = formData;
  const findPosition = await Position.findOne({ election, position });
  if (findPosition) {
    throw new ConflictError();
  }
  const newPosition = Position(formData);
  await newPosition.save();
  if (newPosition) {
    await Election.updateOne(
      { _id: election },
      {
        $push: { positions: newPosition._id },
      }
    );
    return newPosition;
  }
  throw new InternalServerError();
};

// get positions for an elections
const getPositionsByElection = async function (election) {
  const positions = await Position.find({ election }).exec();
  return positions;
};

// get positions for an elections
const getPositionsByElectionAndId = async function ({ id, election }) {
  const positions = await Position.findOne({ _id: id, election: election });
  if (!positions) throw new NotFoundError();
  return positions;
};

// update an election using name and user id
const updatePositionById = async function ({ id, election, formData }) {
  const findPosition = await getPositionsByElectionAndId({
    id,
    election,
  });
  if (findPosition.election.toString() !== election) {
    throw new UnauthorizedError();
  }
  return await Position.findByIdAndUpdate(id, formData, { new: true });
};

// delete an election using id and user id
const deleteAPosition = async function ({ id, election }) {
  const findPosition = await getPositionsByElectionAndId({
    id,
    election,
  });

  const findElection = await getElectionById(election);
  const filteredPositions = findElection.positions.filter(
    (positon) => positon.toString() !== id
  );
  await updateAnElectionById({
    id: election,
    formData: {
      positions: filteredPositions,
    },
  });
  await Candidate.deleteMany({ position: id });
  return await Position.findByIdAndDelete(id);
};

module.exports = {
  getAllPositions,
  getPositionById,
  getPositionsByElection,
  createNewPosition,
  updatePositionById,
  deleteAPosition,
};
