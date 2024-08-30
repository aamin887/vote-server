const asyncHandler = require("express-async-handler");
const Voters = require("../model/voters.model");

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const addVoter = asyncHandler(async function (req, res) {
  const { firstName, lastName, position } = req.body;

  if (!firstName || !lastName || !position) {
    res.status(400);
    throw new Error("fill all required fields");
  }

  res.json({
    firstName,
    lastName,
    position,
  });
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const getAllVoters = asyncHandler(async function (req, res) {
  res.send("get all candidates");
});
const getVoter = asyncHandler(async function (req, res) {
  res.send("get a candidate");
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const updateVoter = asyncHandler(async function (req, res) {
  res.send("update candidate");
});

/**
 * @Desc    Refresh token
 * @Route   POST /api/auth/refresh
 * @Access  Public
 */
const removeVoter = asyncHandler(async function (req, res) {
  res.send("remove candidate");
});

module.exports = {
  addVoter,
  getAllVoters,
  getVoter,
  updateVoter,
  removeVoter,
};
