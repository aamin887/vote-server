const express = require("express");
const router = express.Router();
// version one
const electionRoute = require("./v1/elections.routes");
const positionRoute = require("./v1/positions.routes");
const candidatesRoute = require("./v1/candidates.routes");
const votersRoute = require("./v1/voters.routes");

router.use("/elections", electionRoute);
router.use("/positions", positionRoute);
router.use("/candidates", candidatesRoute);
router.use("/voters", votersRoute);

module.exports = router;
