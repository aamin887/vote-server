const asyncHandler = require("express-async-handler");
const Elections = require("../model/election.model");
const Candidates = require("../model/candidates.model");
const Positions = require("../model/position.model");
const createElectionPoster = require("../utils/createElectionPoster");
const gcsUploader = require("../utils/gcsUpload");

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
    throw new Error("fill all required fields");
  }

  // check if organiser have created election with same name before
  const checkElection = await Elections.findOne({ electionName, organisation });

  if (checkElection) {
    res.status(409);
    throw new Error(`You can not create another election with ${electionName}`);
  }

  try {
    const poster = await createElectionPoster(
      electionName,
      organisation,
      description
    );

    await Elections.create({
      electionName,
      description,
      organisation,
      startDate,
      poster,
      endDate,
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    console.log("i");
    res.sendStatus(400);
  }
});

/**
 * @Desc    Get all elections
 * @Route   POST /v1/election
 * @Access  PRIVATE
 */
const getAllElections = asyncHandler(async function (req, res) {
  const { org } = req?.query;

  try {
    // if an organisation is specified, return for that organisation
    const allElections = await Elections.find({ organisation: org });
    res.status(200).json({
      elections: allElections,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

/**
 * @Desc    Get an election by ID
 * @Route   POST /v1/elections/:id
 * @Access  PRIVATE
 */
const getElection = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { org } = req.query;

  try {
    const oneElection = await Elections.find({ _id: id, organisation: org });

    if (!oneElection) {
      res.status(404);
      throw new Error("could not find election");
    }

    res.status(200).json({
      election: oneElection[0],
    });
  } catch (error) {
    res.status(400);
    throw new Error("Can not get election");
  }
});
/**


/**
 * @Desc    Update an election
 * @Route   PUT /v1/elections/:id
 * @Access  PRIVATE
 */
const updateElection = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { org } = req.query;
  const body = req?.body;

  const imgfile = req?.file;

  let profilePhoto;

  if (imgfile) {
    profilePhoto = await gcsUploader(imgfile.buffer, imgfile.originalname);
  }

  const updatedElection = { ...req.body, poster: profilePhoto };

  const election = await Elections.findById(id);

  if (!election) {
    res.status(404);
    throw new Error("Can not find election");
  }

  try {
    if (election.organisation.toString() !== org) {
      res.status(401);
      throw new Error("not allowed");
    }
    await Elections.findByIdAndUpdate(id, updatedElection);

    res.sendStatus(204);
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
    await Positions.deleteMany({ electionId: id });
    const positions = findElection.positions;

    positions.forEach(async (position) => {
      await Candidates.deleteMany({ position });
    });

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
  removeElection,
  updateElection,
  getElection,
};
