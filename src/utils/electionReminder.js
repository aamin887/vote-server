const cron = require("node-cron");
const Election = require("../model/election.model");
const moment = require("moment");
// Cron job to check elections daily at midnight

const checkElection = async function () {
  const today = moment().add(1, "days").format("YYYY-MM-DD");

  const election = await Election.find();
  console.log("Running election check...", today);
};

const electionReminder = cron.schedule("* * * * * *", () => {
  checkElection();
});

module.exports = {
  electionReminder,
};
