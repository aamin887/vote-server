const asyncHandler = require("express-async-handler");
const {
  addCandidate,
  getCandidatesByPositionAndElection,
  getCandidatesByElection,
  updateCandidateById,
} = require("../../services/api/candidates.service");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../../helpers/CustomError.lib");
const { gcsDelete } = require("../../utils/gcsUpload");

/**
 * @Desc    Add a candidate to a position
 * @Route   POST /v1/candidates
 * @Access  Private
 */
const createCandidate = asyncHandler(async function (req, res) {
  const imgfile = req?.file;
  let { fullName, election, position, manifesto } = req.body;
  if (!fullName || !election || !position || !manifesto) {
    throw new BadRequestError("fill all form fields");
  }

  let formData = { ...req.body };
  if (imgfile) {
    formData = { ...formData, imgfile };
  }
  const newCandidate = await addCandidate({
    formData,
  });
  if (newCandidate) return res.status(201).json(newCandidate);
  throw new InternalServerError();
});

/**
 * @Desc    Get candidates for a position in an election
 * @Route   POST /v1/candidates/election/position
 * @Access  Private
 */
const getCandidateForElectionPosition = asyncHandler(async function (req, res) {
  try {
    const { election, position } = req.params;
    const candidates = await getCandidatesByPositionAndElection({
      election,
      position,
    });

    res.json(candidates);
  } catch (error) {
    throw new InternalServerError();
  }
});

/**
 * @Desc    Get candidates for elections
 * @Route   POST /v1/candidates/election
 * @Access  Private
 */
const getCandidateForElection = async function (req, res) {
  try {
    const { election } = req.params;
    console.log(election);

    const candidates = await getCandidatesByElection(election);

    res.status(200).json(candidates);
  } catch (error) {
    throw new InternalServerError();
  }
};

/**
 * @Desc    Update a candidate
 * @Route   POST /v1/candidates/election
 * @Access  Private
 */
const updateCandidate = asyncHandler(async function (req, res) {
  const { candidateId } = req.params;
  const formData = req.body;

  const updatedCandidate = await updateCandidateById({
    id: candidateId,
    formData,
  });

  res.status(200).json(updatedCandidate);
});

/**
 * @Desc    Update a candidate
 * @Route   POST /v1/candidates/election
 * @Access  Private
 */
const deleteCandidate = asyncHandler(async function (req, res) {
  const { candidateId } = req.params;

  // await gcsDelete("first 1.png"); => deleting candidate image with candidate info
  res.send(
    `delete candidate and remove image from the cloud => ${candidateId}`
  );
});
module.exports = {
  createCandidate,
  getCandidateForElectionPosition,
  getCandidateForElection,
  updateCandidate,
  deleteCandidate,
};