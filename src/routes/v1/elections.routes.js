const express = require("express");
const router = express.Router();
const electionsController = require("../../controllers/api/elections.controller");
const uploads = require("../../config/upload.config");
const paginatedRoute = require("../../utils/paginatedRoute.utils");
const Election = require("../../model/election.model");

router
  .route("/")
  .post(electionsController.createElection)
  .get(paginatedRoute(Election), electionsController.getAllElections);

router
  .route("/:id")
  .get(electionsController.getElection)
  .put(uploads.single("image"), electionsController.updateElections)
  .delete(electionsController.deleteElections);

// voters
router.route("/:id/voters").get(electionsController.getVoters);
router
  .route("/:id/voters")
  .post(uploads.single("image"), electionsController.registerVoters);

module.exports = router;
