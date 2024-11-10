const express = require("express");
const router = express.Router();

const statusController = require("../../controllers/status.controller");

// check if API is active
router
  .route("/")
  .get(statusController.getStatus)
  .post(statusController.createStatus);

module.exports = router;
