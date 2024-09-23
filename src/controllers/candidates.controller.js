const asyncHandler = require("express-async-handler");
const Candidates = require("../model/candidates.model");
const gcsUploader = require("../utils/gcsUpload");
const fs = require("fs").promises;
const path = require("path");
const Position = require("../model/position.model");

/**
 * @Desc    Add a candidate
 * @Route   POST /v1/candidates
 * @Access  Private
 */
const addCandidate = asyncHandler(async function (req, res) {
  const { fullName, position, manifesto, organisation } = req.body;
  const imgfile = req?.file;

  try {
    const findCandidate = await Candidates.findOne({ position, fullName });

    if (findCandidate) {
      res.sendStatus(403);
      return;
    }

    let candidateInfo = {
      fullName,
      position,
      manifesto,
      organisation,
    };

    if (imgfile) {
      const profilePhoto = await gcsUploader(
        imgfile.buffer,
        imgfile.originalname
      );
      candidateInfo = { ...candidateInfo, profilePhoto };
    }

    const newCandidate = await Candidates.create(candidateInfo);

    if (newCandidate) {
      await Position.updateOne(
        { _id: newCandidate.position },
        {
          $push: { candidates: newCandidate._id },
        }
      );
    }

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(400);
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
    res.status(404);
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

  try {
    const candidate = await Candidates.findById(id);

    if (!candidate) {
      res.status(404);
      throw new Error("candidate not found");
    }

    const positionId = candidate?.position;
    const candidatePosition = await Position.findById(positionId);
    const positionCandidates = candidatePosition.candidates;
    const filteredCandidate = positionCandidates.filter(
      (candidate) => candidate.toString() !== id
    );

    await Position.findByIdAndUpdate(positionId, {
      candidates: filteredCandidate,
    });

    await Candidates.findByIdAndDelete(id);
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
