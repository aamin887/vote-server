const asyncHandler = require("express-async-handler");
const { ValidationError } = require("../helpers/CustomError.lib");

/**
 * @Desc    Getting API status
 * @Route   GET /v1/status
 * @Access  Public
 */
const getStatus = asyncHandler(async function (req, res) {
  const currentDate = new Date();

  try {
    res.status(200).json({
      date: currentDate.toLocaleDateString().toString(),
      message: "GET: api is active",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

/**
 * @Desc    Create status
 * @Route   POST /v1/status
 * @Access  Public
 */
const createStatus = asyncHandler(async function (req, res) {
  const currentDate = new Date();

  try {
    const response = {
      date: currentDate.toLocaleDateString().toString(),
      message: "POST: api is active",
    };
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = {
  getStatus,
  createStatus,
};
