const asyncHandler = require("express-async-handler");
const Candidates = require("../model/candidates.model");
const Position = require("../model/position.model");

/**
 * @Desc    Add a candidate
 * @Route   POST /v1/candidates
 * @Access  Private
 */
const addCandidate = asyncHandler(async function (req, res) {
  console.log(req.body);
  const findCandidate = await Candidates.insertMany(req.body);

  findCandidate.forEach(async (candidate, idx) => {
    await Position.updateOne(
      { _id: candidate.position },
      {
        $push: { candidates: candidate._id },
      }
    );
  });

  if (!findCandidate) {
    res.status(400);
    throw new Error("could not candidates");
  } else {
    res.sendStatus(201);
  }
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const getAllCandidates = asyncHandler(async function (req, res) {
  const { id } = req.params;
  try {
    const candidates = await Candidates.find({ position: id });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(400);
    throw new Error("can not get all candidates");
  }
});

const allCandidates = asyncHandler(async function (req, res) {
  const { id } = req.params;
  try {
    const candidates = await Candidates.find({ organisation: id });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(400);
    throw new Error("can not get all candidates");
  }
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const getCandidate = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const candidate = await Candidates.findById(id);

    if (!candidate) {
      res.status(400);
      throw new Error("candidate not found");
    }

    res.status(200).json({ candidate });
  } catch (error) {
    res.status(400);
    throw new Error("can not get candidate");
  }
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const updateCandidate = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const candidate = await Candidates.findById(id);

  if (!candidate) {
    res.status(400);
    throw new Error("candidate not found");
  }

  try {
    await Candidates.findByIdAndUpdate(id, req.body);
    const updatedCandidate = await Candidates.findById(id);
    res.status(200).json(updatedCandidate);
  } catch (error) {
    res.status(400);
    throw new Error("can not get candidate");
  }
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const removeCandidate = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const candidate = await Candidates.findById(id);

  if (!candidate) {
    res.status(400);
    throw new Error("candidate not found");
  }

  try {
    await Candidates.findByIdAndDelete(id, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not delete candidate");
  }
});
/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const removeCandidatesByPosition = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    await Candidates.deleteMany({ position: id });
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not delete candidate");
  }
});

module.exports = {
  addCandidate,
  getAllCandidates,
  allCandidates,
  getCandidate,
  updateCandidate,
  removeCandidate,
  removeCandidatesByPosition,
};
