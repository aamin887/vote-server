const Candidate = require("../../model/candidates.model");
const { updatePosition } = require("./position.service");
const Position = require("../../model/position.model");
const { gcsUploader, gcsDelete } = require("../../utils/gcsUpload");

const {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

const getCandidatesByElection = async function (election) {
  try {
    const candidates = await Candidate.find({ election });
    return candidates;
  } catch (error) {
    throw new UnauthorizedError();
  }
};

// get candidates using name and position
const getCandidateByNameAndPosition = async function ({ fullName, position }) {
  try {
    const candidate = await Candidate.findOne({ fullName, position });
    return candidate;
  } catch (error) {
    throw new UnauthorizedError();
  }
};

// get candidates using position and election
const getCandidatesByPositionAndElection = async function (formData) {
  const { position, election } = formData;
  const candidates = await Candidate.find({ position, election });
  return candidates;
};

// get candidate by id
const getCandidateById = async function (id) {
  const candidate = await Candidate.findById(id);
  if (!candidate) throw new NotFoundError();
  return candidate;
};

// add a new candidate
const addCandidate = async function ({ formData }) {
  const { fullName, position, election, manifesto, imgfile } = formData;
  const candidate = await getCandidateByNameAndPosition({
    fullName,
    position,
  });
  if (candidate) {
    throw new ConflictError();
  }

  const newCandidate = await Candidate.create({
    fullName,
    manifesto,
    election,
    position,
  });
  if (newCandidate) {
    // should return photoURL and photoId
    const profilePhoto = await gcsUploader(
      imgfile.buffer,
      imgfile.originalname
    );

    // update
    await Position.updateOne(
      { _id: position },
      {
        $push: { candidates: newCandidate._id },
      }
    );
    // update candidate data
    return await updateCandidateById({
      id: newCandidate._id,
      formData: {
        photoUrl: profilePhoto,
        photoId: "1344",
      },
    });
  } else {
    throw new BadRequestError();
  }
};

//update a candidate by ID
const updateCandidateById = async function ({ id, formData }) {
  const findCandidate = await Candidate.findById(id).exec();
  if (!findCandidate) {
    throw new NotFoundError();
  }
  return await Candidate.findByIdAndUpdate(id, formData, { new: true });
};

// delete a candidate by ID
const deleteCandidateById = async function (id) {
  return await Candidate.findByIdAndDelete(id);
};

module.exports = {
  addCandidate,
  getCandidateByNameAndPosition,
  getCandidatesByPositionAndElection,
  getCandidateById,
  updateCandidateById,
  deleteCandidateById,
  getCandidatesByElection,
};
