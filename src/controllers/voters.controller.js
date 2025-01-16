const asyncHandler = require("express-async-handler");
const User = require("../model/user.model");
const { gcsDelete, gcsUploader } = require("../utils/gcsUpload");
const { NotFoundError } = require("../helpers/CustomError.lib");

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
  const { id } = req.params;
  let formData = { ...req.body };
  const imgfile = req?.file;

  const findVoter = await User.findById(id).exec();

  if (!findVoter) throw NotFoundError();

  if (imgfile) {
    if (findVoter?.photoId && findVoter?.photoUrl) {
      //remove profile image from cloud
      await gcsDelete(findVoter?.photoId);
    }
    // replace removed image width current image
    const profilePhoto = await gcsUploader(
      imgfile.buffer,
      imgfile.originalname,
      findVoter?.fullName
    );
    formData = {
      ...formData,
      photoUrl: profilePhoto?.url,
      photoId: profilePhoto?.name,
    };
  }
  const updatedVoter = await User.findByIdAndUpdate(id, formData, {
    new: true,
  });

  res.status(200).json(updatedVoter);
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
