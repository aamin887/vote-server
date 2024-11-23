const Position = require("../../model/position.model");
const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

// get an election using id
const getPositionById = async function (id) {
  const position = await Position.findById(id);

  if (!position) {
    throw new NotFoundError();
  }

  return position;
};

// create a new election
const createNewPosition = async function ({ formData }) {
  try {
    const newPosition = Position(formData);
    await newPosition.save();
    return newPosition;
  } catch (error) {
    throw new Error(error);
  }
};

// update an election using name and user id
const updatePosition = async function ({ formData }) {
  const { id, election } = formData;
  const findPosition = await getPositionById({ id });

  if (findPosition.election.toString() !== election) {
    throw new UnauthorizedError();
  }

  return await Position.findByIdAndUpdate(id, formData, { new: true });
};

// delete an election using id and user id
const deleteAPosition = async function ({ id, election }) {
  try {
    const findPosition = await getPositionById(id);

    if (!findPosition) {
      throw new NotFoundError();
    }

    if (findPosition.election.toString() !== election) {
      throw new UnauthorizedError();
    }
    return await Position.findByIdAndDelete(id);
  } catch (error) {
    throw new InternalServerError();
  }
};

module.exports = {
  getPositionById,
  createNewPosition,
  updatePosition,
  deleteAPosition,
};
