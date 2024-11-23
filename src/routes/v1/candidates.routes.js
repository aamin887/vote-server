const express = require("express");
const router = express.Router();
const uploads = require("../../config/upload.config");
const candidatesController = require("../../controllers/api/candidates.controller");

router
  .route("/")
  .post(uploads.single("image"), candidatesController.createCandidate);

router.route("/:candidateId").put(candidatesController.updateCandidate);

router
  .route("/:election/:position")
  .get(candidatesController.getCandidateForElectionPosition);

router.route("/:election").get(candidatesController.getCandidateForElection);

router.route("/:candidateId").delete(candidatesController.deleteCandidate);

module.exports = router;
