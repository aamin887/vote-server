const express = require("express");
const router = express.Router();
const electionsController = require("../../controllers/api/elections.controller");
const uploads = require("../../config/upload.config");
const paginatedRoute = require("../../utils/paginatedRoute.utils");
const Election = require("../../model/election.model");

// elections
router
  .route("/")
  .post(electionsController.createElection)
  .get(paginatedRoute(Election), electionsController.getAllElections);

router
  .route("/:id")
  .get(electionsController.getElection)
  .put(uploads.single("image"), electionsController.updateElections)
  .delete(electionsController.deleteElections);

// register voter
router
  .route("/:id/voters")
  .post(uploads.single("image"), electionsController.registerVoters);

// voters
router.route("/:id/voters").get(electionsController.getVoters);

// results
router.route("/:id/results").get((req, res) => {
  res.send("Hi, result");
});

module.exports = router;
