const asyncHandler = require("express-async-handler");
const { ValidationError } = require("../lib/CustomError.lib");

const getStatus = asyncHandler(async function (req, res) {
  const currentDate = new Date();

  try {
    throw new ValidationError("Can");
    res.status(200).json({
      date: currentDate.toLocaleDateString().toString(),
      message: "api is active",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = {
  getStatus,
};
