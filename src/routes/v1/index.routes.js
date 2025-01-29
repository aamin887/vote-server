const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");
const voterAuth = require("../../middleware/voter.middleware");

router.use("/status", auth, require("../status/status.routes"));
router.use("/elections", auth, require("./elections.routes"));
router.use("/positions", auth, require("./positions.routes"));
router.use("/candidates", auth, require("./candidates.routes"));
router.use("/logs", require("./logs.routes.js"));
router.use("/stats", auth, require("./stats.routes"));

router.use("/cast", voterAuth, require("./votes.routes"));

router.use("/voters", auth, require("./voters.routes"));

module.exports = router;
