const express = require("express");
const router = express.Router();

const electionRoute = require("./elections.routes");
const positionRoute = require("./positions.routes");
const candidatesRoute = require("./candidates.routes");
const votersRoute = require("./voters.routes");

router.use("/elections", electionRoute);
router.use("/positions", positionRoute);
router.use("/candidates", candidatesRoute);
router.use("/voters", votersRoute);

module.exports = router;
