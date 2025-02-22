const asyncHandler = require("express-async-handler");
const { BadRequestError } = require("../helpers/CustomError.lib");

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
    throw new BadRequestError("API seems down");
  }
});

/**
 * @Desc    Create status
 * @Route   POST /v1/status
 * @Access  Public
 */
const createStatus = asyncHandler(async function (req, res) {
  const currentDate = new Date();
  const { message } = req.body;

  if (!message) {
    throw new BadRequestError("enter a message!!");
  }

  const response = {
    date: currentDate.toLocaleDateString().toString(),
    message: `You ask the API to say: ${message}`,
  };

  res.status(201).json(response);

  throw new BadRequestError("API seems down");
});

module.exports = {
  getStatus,
  createStatus,
};
