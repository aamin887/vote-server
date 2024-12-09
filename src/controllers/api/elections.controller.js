const asyncHandler = require("express-async-handler");
// services
const {
  getElectionByNameAndCreator,
  createNewElection,
  getByElectionsByCreator,
  updateAnElection,
  deleteAnElection,
  getByElectionByCreatorAndId,
} = require("../../services/api/elections.service");
// error classes
const {
  BadRequestError,
  ConflictError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

/**
 * @Desc    Create an election
 * @Route   POST /v1/elections
 * @Access  PRIVATE
 */
const createElection = asyncHandler(async function (req, res) {
  const { name, description, startDate, endDate } = req.body;
  const creator = req.user._id;

  if (!name || !description || !startDate || !endDate) {
    res.status(400);
    throw new BadRequestError("fill all fields");
  }

  const checkForElection = await getElectionByNameAndCreator({
    name,
    creator,
  });
  if (checkForElection) {
    throw new ConflictError("election already exist with this name");
  }

  const formData = {
    name,
    description,
    startDate,
    endDate,
    creator,
  };
  const newElection = await createNewElection({ formData });
  if (newElection) return res.status(201).json(newElection);

  throw new InternalServerError();
});

/**
 * @Desc    Retrieve one election
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getElection = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  const elections = await getByElectionByCreatorAndId({ id, creator });
  if (elections) return res.status(200).json(elections);
  throw new InternalServerError();
});

/**
 * @Desc    Retrieve all elections
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getAllElections = asyncHandler(async function (req, res) {
  const elections = res.paginatedResults;
  console.log(elections);
  if (elections) return res.status(200).json(elections);
});

/**
 * @Desc    uodate an election
 * @Route   PUT /v1/elections
 * @Access  PRIVATE
 */
const updateElections = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const formData = req.body;
  const id = req.params?.id;

  const updatedElection = await updateAnElection({ id, creator, formData });
  if (updatedElection) return res.status(200).json(updatedElection);
  throw new InternalServerError();
});

/**
 * @Desc    Delete an election
 * @Route   DELETE /v1/elections
 * @Access  PRIVATE
 */
const deleteElections = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  if (await deleteAnElection({ id, creator })) return res.sendStatus(204);
  throw new InternalServerError();
});

module.exports = {
  createElection,
  getElection,
  getAllElections,
  updateElections,
  deleteElections,
};
