const Election = require("../../model/election.model");
const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

// get an election using id
const getElectionById = async function (id) {
  try {
    const election = await Election.findById(id);
    if (!election) {
      throw new NotFoundError();
    }
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

// get an election using user id
const getByElectionsByCreator = async function ({ creator }) {
  try {
    const election = await Election.find({ creator });
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

// get an election using name
const getByElectionByCreatorAndId = async function ({ id, creator }) {
  try {
    const election = await Election.findOne({ _id: id, creator });

    if (!election) {
      throw new NotFoundError();
    }

    return election;
  } catch (error) {
    throw new Error(error);
  }
};

// get an election using name and user id
const getElectionByNameAndCreator = async function ({ name, creator }) {
  try {
    const election = await Election.findOne({ name, creator });
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

// create a new election
const createNewElection = async function ({ formData }) {
  try {
    const election = Election(formData);
    await election.save();
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

// update an election using name and user id
const updateAnElection = async function ({ id, creator, formData }) {
  try {
    const findElection = await getByElectionByCreatorAndId({ id, creator });
    if (findElection.creator.toString() !== creator) {
      throw new UnauthorizedError();
    }
    return await Election.findByIdAndUpdate(id, formData, { new: true });
  } catch (error) {
    throw new Error(error);
  }
};
// update an election using name and user id
const updateAnElectionById = async function ({ id, formData }) {
  try {
    return await Election.findByIdAndUpdate(id, formData, { new: true });
  } catch (error) {
    throw new Error(error);
  }
};

// delete an election using id and user id
const deleteAnElection = async function ({ id, creator }) {
  try {
    const findElection = await getElectionById(id);
    if (!findElection) {
      throw new NotFoundError();
    }
    if (findElection.creator.toString() !== creator) {
      throw new UnauthorizedError();
    }
    return await Election.findByIdAndDelete(id);
  } catch (error) {
    throw new InternalServerError();
  }
};
// delete an election using id and user id
const deleteAnElectionById = async function (id) {
  try {
    const findElection = await getElectionById(id);
    if (!findElection) {
      throw new NotFoundError();
    }
    return await Election.findByIdAndDelete(id);
  } catch (error) {
    throw new InternalServerError();
  }
};

module.exports = {
  getElectionById,
  getElectionByNameAndCreator,
  getByElectionsByCreator,
  createNewElection,
  updateAnElection,
  updateAnElectionById,
  getByElectionByCreatorAndId,
  deleteAnElection,
  deleteAnElectionById,
};