const express = require("express");
const router = express.Router();
const candidatesController = require("../../controllers/candidates.controller");

router.route("/").post(candidatesController.addCandidate);

router
  .route("/:id")
  .get(candidatesController.getAllCandidates)
  .get(candidatesController.getCandidate)
  .put(candidatesController.updateCandidate)
  .delete(candidatesController.removeCandidate);
router
  .route("/positions/:id")
  .delete(candidatesController.removeCandidatesByPosition);

module.exports = router;
