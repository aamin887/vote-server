const Election = require("../../model/election.model");

const getElectionById = async function (id) {
  try {
    const election = await Election.findById(id);
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

const getByElectionByCreator = async function () {
  try {
    const election = await Election.findOne({ name, creator });
    return election;
  } catch (error) {
    throw new Error(error);
  }
};
const getByElectionByName = async function () {
  try {
    const election = await Election.findOne({ name, creator });
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

const getElectionByNameAndCreator = async function ({ name, creator }) {
  try {
    const election = await Election.findOne({ name, creator });
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

const createNewElection = async function () {
  try {
    const election = await Election.findById(id);
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

const updateAnElection = async function () {
  try {
    const election = await Election.findById(id);
    return election;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteAnElection = async function () {
  try {
    const election = await Election.findById(id);
    return election;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getElectionById,
  getElectionByNameAndCreator,
  getByElectionByCreator,
  getByElectionByName,
  createNewElection,
  updateAnElection,
  deleteAnElection,
};
