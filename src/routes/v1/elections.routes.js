const express = require("express");
const router = express.Router();
const electionsController = require("../../controllers/api/elections.controller");
const uploads = require("../../config/upload.config");

router.route("/").post(electionsController.createElection);
//   .get(electionsController.getAllElections);

// router
//   .route("/:id")
//   .get(electionsController.getElection)
//   .put(uploads.single("image"), electionsController.updateElection)
//   .delete(electionsController.removeElection);

module.exports = router;
