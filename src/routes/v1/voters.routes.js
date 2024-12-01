const express = require("express");
const router = express.Router();
const votersController = require("../../controllers/voters.controller");

router
  .route("/")
  .post(votersController.addVoter)
  .get(votersController.getAllVoters);

router
  .route("/:id")
  .get(votersController.getVoter)
  .put(votersController.updateVoter)
  .delete(votersController.removeVoter);

module.exports = router;
