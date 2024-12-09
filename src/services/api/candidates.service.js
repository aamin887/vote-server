const Candidate = require("../../model/candidates.model");
const { getPositionById } = require("./position.service");
const Position = require("../../model/position.model");
const { getElectionById } = require("./elections.service");
const { gcsUploader, gcsDelete } = require("../../utils/gcsUpload");

const {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

// get candidates by elections
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
    console.log(error);

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
  await getElectionById(election);
  await getPositionById(position);
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
        photoUrl: profilePhoto.url,
        photoId: profilePhoto.name,
      },
    });
  } else {
    throw new InternalServerError();
  }
};

//update a candidate by ID
const updateCandidateById = async function ({ id, formData }) {
  const { imgfile } = formData;
  let formattedData = { ...formData };
  const findCandidate = await Candidate.findById(id).exec();
  if (!findCandidate) {
    throw new NotFoundError();
  }
  if (formData?.imgfile) {
    if (formData?.photoId && formData?.photoUrl) gcsDelete(formData?.photoId); //remove profile image from cloud
    const profilePhoto = await gcsUploader(
      imgfile.buffer,
      imgfile.originalname
    );
    formattedData = {
      ...formattedData,
      photoUrl: profilePhoto.url,
      photoId: profilePhoto.name,
    };
  }
  return await Candidate.findByIdAndUpdate(id, formattedData, { new: true });
};

// delete a candidate by ID
const deleteCandidateById = async function (id) {
  const findCandidate = await Candidate.findById(id);
  if (!findCandidate) throw new NotFoundError("candidate not found");
  const { _id, photoId, photoUrl, position } = findCandidate;
  if (photoId && photoUrl) gcsDelete(photoId); //remove profile image from cloud
  if (await Candidate.findByIdAndDelete(id)) {
    // add candidate position
    await Position.updateOne(
      { _id: position },
      {
        $pull: { candidates: _id },
      }
    );
  }
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
