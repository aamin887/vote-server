const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");

router.use("/status", require("../status/status.routes"));

router.use("/elections", auth, require("./elections.routes"));
router.use("/candidates", require("./candidates.routes"));
// router.use("/positions", require("./v1/positions.routes"));
// router.use("/voters", require("./v1/voters.routes"));

module.exports = router;
