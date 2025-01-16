const path = require("path");
const express = require("express");
const router = express.Router();

// path can be => '/' or index.html or index
router.route("^/$|/index(.html)?").get((req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));
});

module.exports = router;
