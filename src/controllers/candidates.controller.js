const asyncHandler = require("express-async-handler");
const Candidates = require("../model/candidates.model");

/**
 * @Desc    Add a candidate
 * @Route   POST /v1/candidates
 * @Access  Private
 */
const addCandidate = asyncHandler(async function (req, res) {
  const { firstName, lastName, position } = req.body;

  if (!firstName || !lastName || !position) {
    res.status(400);
    throw new Error("fill all required fields");
  }

  const findCandidate = await Candidates.findOne({ firstName });

  if (findCandidate) {
    res.status(400);
    throw new Error("already created candidates");
  }

  const newCandidate = await Candidates.create({
    firstName,
    lastName,
    position,
  });

  if (!newCandidate) {
    res.status(400);
    throw new Error("could not candidates");
  } else {
    res.status(201).json(newCandidate);
  }
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const getAllCandidates = asyncHandler(async function (req, res) {
  try {
    const allCandidates = await Candidates.find();

    res.status(200).json({
      candidates: allCandidates,
    });
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

    res.status(200).json(candidate);
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

module.exports = {
  addCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
  removeCandidate,
};
