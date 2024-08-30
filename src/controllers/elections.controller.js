const asyncHandler = require("express-async-handler");
const Elections = require("../model/election.model");

/**
 * @Desc    Create an election
 * @Route   POST /v1/election
 * @Access  PRIVATE
 */
const createElection = asyncHandler(async function (req, res) {
  const { electionName, description, startDate, organisation } = req.body;

  console.log(req.body);

  if (!electionName || !description || !startDate || !organisation) {
    res.status(400);
    throw new Error("fill all required fields");
  }

  const checkElection = await Elections.findOne({ electionName });

  if (checkElection) {
    res.status(400);
    throw new Error(`You can not create another election with ${electionName}`);
  }

  try {
    const newElection = await Elections.create({
      electionName,
      description,
      organisation,
      startDate,
      endDate: startDate,
    });

    res.status(201).json(newElection);
  } catch (error) {
    res.status(400);
    throw new Error("can not create an election");
  }
});

/**
 * @Desc    Get all elections
 * @Route   POST /v1/election
 * @Access  PRIVATE
 */
const getAllElections = asyncHandler(async function (req, res) {
  const { org } = req.query;
  try {
    const allElections = await Elections.find({ organisation: org });
    res.status(200).json({
      elections: allElections,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Can not get all elections");
  }
});

/**
 * @Desc    Get an election
 * @Route   POST /v1/elections/:id
 * @Access  PRIVATE
 */
const getElection = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const oneElection = await Elections.findById(id);

    if (!oneElection) {
      res.status(404);
      throw new Error("could not find election");
    }
    res.status(200).json({
      election: oneElection,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Can not get election");
  }
});
/**
 * @Desc    Get an election
 * @Route   POST /v1/elections/:id
 * @Access  PRIVATE
 */
const getElections = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const oneElection = await Elections.findById(id);

    if (!oneElection) {
      res.status(404);
      throw new Error("could not find election");
    }
    res.status(200).json({
      election: oneElection,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Can not get election");
  }
});

/**
 * @Desc    Update an election
 * @Route   PUT /v1/elections/:id
 * @Access  PRIVATE
 */
const updateElection = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const body = req?.body;

  const election = await Elections.findById(id);

  if (!election) {
    res.status(404);
    throw new Error("Can not find election");
  }

  try {
    await Elections.findByIdAndUpdate(id, body);
    const updatedElection = await Elections.findById(id);

    res.status(200).json(updatedElection);
  } catch (error) {
    res.status(400);
    throw new Error("can not update election");
  }
});

/**
 * @Desc    Delete an election
 * @Route   DELETE /v1/election/:id
 * @Access  PRIVATE
 */
const removeElection = asyncHandler(async function (req, res) {
  const { id } = req.params;
  try {
    const findElection = await Elections.findById(id);

    if (!findElection) {
      res.status(404);
      throw new Error("could not find election");
    }

    await Elections.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("unable to  election");
  }
});

module.exports = {
  createElection,
  getAllElections,
  getElection,
  getElections,
  updateElection,
  removeElection,
};
