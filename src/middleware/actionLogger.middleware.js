const fs = require("fs");
const path = require("path");

// Define the log file path
const logFilePath = path.join(__dirname, "userActionsLog.json");

// Middleware to log user actions
const actionLogger = (req, res, next) => {
  const user = req?.user ? req?.user?.userName : "Anonymous"; // Assuming req.user contains authenticated user info

  const url = req.path; // The endpoint/resource being accessed
  const regex = /\/v1\/([^\/]+)/;
  const resource = url.match(regex) ? url.match(regex) : url;
  const method = req.method; // The HTTP method (GET, POST, etc.)
  const timestamp = new Date().toISOString();

  // Log entry format
  const logEntry = {
    user,
    resource,
    method,
    timestamp,
  };

  // Read existing logs, add the new log entry, and save back to the file
  fs.readFile(logFilePath, "utf8", (err, data) => {
    let logs = [];

    if (!err && data) {
      try {
        logs = JSON.parse(data); // Parse existing logs
      } catch (parseError) {
        console.error("Error parsing log file:", parseError);
      }
    }

    logs.push(logEntry); // Add the new log entry

    // Write logs back to the file
    fs.writeFile(
      logFilePath,
      JSON.stringify(logs, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to log file:", writeErr);
        }
      }
    );
  });

  next(); // Continue to the next middleware or route handler
};

module.exports = actionLogger;
