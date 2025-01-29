const express = require("express");
const router = express.Router();
const uploads = require("../../config/upload.config");
const candidatesController = require("../../controllers/api/candidates.controller");

router
  .route("/")
  .post(uploads?.single("image"), candidatesController.createCandidate);

//get candidates for an election
router
  .route("/elections/:election")
  .get(candidatesController.getCandidateForElection);

//get candidates for a position in an election
router
  .route("/:election/:position")
  .get(candidatesController.getCandidateForElectionPosition);

// get a candidate by Id
router.route("/:candidateId").get(candidatesController.getCandidateId);

// update a candidate
router
  .route("/:candidateId")
  .put(uploads.single("image"), candidatesController.updateCandidate);

// delete a candidate
router.route("/:candidateId").delete(candidatesController.deleteCandidate);

module.exports = router;
