const express = require("express");
const votersController = require("../../controllers/voters.controller");
const uploads = require("../../config/upload.config");

const router = express.Router();

router
  .route("/")
  .post(votersController.addVoter)
  .get(votersController.getAllVoters);

router
  .route("/:id")
  .get(votersController.getVoter)
  .put(uploads.single("image"), votersController.updateVoter)
  .delete(votersController.removeVoter);

module.exports = router;
