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
    throw new NotFoundError();
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

// update an election using name and user id
const updatePositionById = async function ({ id, formData }) {
  const findPosition = await getPositionById(id);
  if (findPosition.election.toString() !== formData.election) {
    throw new UnauthorizedError();
  }
  return await Position.findByIdAndUpdate(id, formData, { new: true });
};

// delete an election using id and user id
const deleteAPosition = async function ({ id }) {
  const findPosition = await getPositionById(id);
  if (!findPosition) {
    throw new NotFoundError();
  }
  const electionId = findPosition.election.toString();
  const election = await getElectionById(electionId);
  const filteredPositions = election.positions.filter(
    (positon) => positon.toString() !== id
  );
  await updateAnElectionById({
    id: electionId,
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
