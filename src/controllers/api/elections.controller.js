const asyncHandler = require("express-async-handler");
const {
  getElectionByNameAndCreator,
  createNewElection,
  getByElectionsByCreator,
  updateAnElection,
  deleteAnElection,
  getByElectionByCreatorAndId,
} = require("../../services/api/elections.service");
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

  try {
    const checkForElection = await getElectionByNameAndCreator({
      name,
      creator,
    });
    if (checkForElection) {
      throw new ConflictError("Cannot create election with this name");
    }

    const formData = {
      name,
      description,
      startDate,
      endDate,
      creator,
    };
    await createNewElection({ formData });
    res.sendStatus(201);
  } catch (error) {
    throw new InternalServerError();
  }
});

/**
 * @Desc    Retrieve one election
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getElection = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  try {
    const elections = await getByElectionByCreatorAndId({ id, creator });
    res.status(200).json(elections);
  } catch (error) {
    throw new InternalServerError();
  }
});

/**
 * @Desc    Retrieve all elections
 * @Route   Get /v1/elections
 * @Access  PRIVATE
 */
const getAllElections = asyncHandler(async function (req, res) {
  try {
    const elections = res.paginatedResults;
    res.status(200).json(elections);
  } catch (error) {
    throw new InternalServerError();
  }
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

  try {
    const updatedElection = await updateAnElection({ id, creator, formData });
    res.status(200).json(updatedElection);
  } catch (error) {
    throw new InternalServerError();
  }
});

/**
 * @Desc    Delete an election
 * @Route   DELETE /v1/elections
 * @Access  PRIVATE
 */
const deleteElections = asyncHandler(async function (req, res) {
  const creator = req.user._id.toString();
  const id = req.params?.id;

  try {
    await deleteAnElection({ id, creator });
    return res.sendStatus(204);
  } catch (error) {
    throw new InternalServerError();
  }
});

module.exports = {
  createElection,
  getElection,
  getAllElections,
  updateElections,
  deleteElections,
};
