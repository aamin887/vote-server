const express = require("express");
const votesController = require("../../controllers/votes.controller");
const uploads = require("../../config/upload.config");

const router = express.Router();

router.route("/:electionId/:candidateId").put(votesController.castVote);

module.exports = router;
