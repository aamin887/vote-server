const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const logFilePath = path.join(
  __dirname,
  "..",
  "..",
  "middleware",
  "userActionsLog.json"
);

router.get("/", (req, res) => {
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file:", err);
      return res.status(500).json({ error: "Could not read log file" });
    }

    try {
      const logs = JSON.parse(data);
      res.json(logs);
    } catch (parseError) {
      console.error("Error parsing log file:", parseError);
      res.status(500).json({ error: "Could not parse log file" });
    }
  });
});

module.exports = router;
