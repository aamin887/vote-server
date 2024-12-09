const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/stats.controller.js");

router.route("/").get(statsController.generalStats);

module.exports = router;
