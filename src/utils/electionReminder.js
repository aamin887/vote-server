const nodeCron = require("node-cron");
const Election = require("../model/election.model");
const User = require("../model/user.model");
const moment = require("moment");
const { mailerInstance } = require("./mailer.utils");
const path = require("path");

// Cron job to check elections daily at midnight
const sendElectionRemainders = async function () {
  // all elections on server
  const now = new Date();
  const next24Hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const elections = await Election.find({
    endDate: { $gte: now, $lte: next24Hrs },
  });

  // find votes
  elections.forEach(async (election) => {
    const voters = await User.find({ elections: election._id });
    voters.forEach(async (voter) => {
      if (voter.verification) {
        // send email
        await mailerInstance.sendHtmlMail({
          from: "alhassanamin96@gmail.com",
          to: voter.email,
          subject: election?.name,
          template: path.join(__dirname, "..", "templates", "reminder.hbs"),
          replacements: {
            username: `${voter.userName}`,
            confirmationLink: "",
          },
        });
      }
      // send email and reminder to verify
    });
  });
};

// run every midnight(12am)
const cronJob = () =>
  nodeCron.schedule("* * * * *", async () => {
    console.log("iH");

    sendElectionRemainders();
  });

module.exports = {
  cronJob,
};
