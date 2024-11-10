const express = require("express");
const router = express.Router();

router.use("/status", require("./status/status.routes"));
router.use("/elections", require("./v1/elections.routes"));
router.use("/positions", require("./v1/positions.routes"));
router.use("/candidates", require("./v1/candidates.routes"));
router.use("/voters", require("./v1/voters.routes"));

module.exports = router;
