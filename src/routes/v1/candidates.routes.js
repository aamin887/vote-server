const express = require("express");
const router = express.Router();
const candidatesController = require("../../controllers/candidates.controller");

router
  .route("/")
  .post(candidatesController.addCandidate)
  .get(candidatesController.getAllCandidates);

router
  .route("/:id")
  .get(candidatesController.getCandidate)
  .put(candidatesController.updateCandidate)
  .delete(candidatesController.removeCandidate);

module.exports = router;
