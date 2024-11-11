const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const { generateUUID } = require("./auth.utils");

const logger = async function (logFile, message) {
  // creating log string
  const logtime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logId = generateUUID();
  const log = `${logtime}\t${logId}\t${message}\n`;

  try {
    // does logs dir exit
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
      await fsPromises.writeFile(
        path.join(__dirname, "..", "logs", logFile),
        `DATE\tTIME\tLOG ID\tMETHOD\tORIGIN\tURL`
      );
    }

    // create file with HEADER
    if (!fs.existsSync(path.join(__dirname, "..", "logs", logFile))) {
      await fsPromises.writeFile(
        path.join(__dirname, "..", "logs", logFile),
        `DATE\t\t\tTIME\t\t\tLOG ID\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMETHOD\tORIGIN\tURL\n`
      );
    }

    // write to log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      log
    );
  } catch (error) {
    throw error;
  }
};

module.exports = logger;
