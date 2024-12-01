const express = require("express");
const router = express.Router();
const uploads = require("../../config/upload.config");
const candidatesController = require("../../controllers/api/candidates.controller");

router
  .route("/")
  .post(uploads.single("image"), candidatesController.createCandidate);

//get candidates for an election
router.route("/:election").get(candidatesController.getCandidateForElection);

//get candidates for a position in an election
router
  .route("/:election/:position")
  .get(candidatesController.getCandidateForElectionPosition);

// update a candidate
router.route("/:candidateId").put(candidatesController.updateCandidate);

// delete a candidate
router.route("/:candidateId").delete(candidatesController.deleteCandidate);

module.exports = router;
