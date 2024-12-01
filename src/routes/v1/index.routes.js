const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");

router.use("/status", require("../status/status.routes"));
router.use("/elections", auth, require("./elections.routes"));
router.use("/candidates", auth, require("./candidates.routes"));
router.use("/positions", auth, require("./positions.routes"));
router.use("/voters", auth, require("./voters.routes"));

module.exports = router;
