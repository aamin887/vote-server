const path = require("path");
const express = require("express");
const router = express.Router();

router.route("*").get(function (req, res) {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ "message ": "404, page not found" });
  } else {
    res.type("txt").send("404, page not found");
  }
});

module.exports = router;
