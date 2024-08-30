const emailTransporter = require("../config/email.config");
const handlebars = require("handlebars");
const fs = require("fs");
const juice = require("juice");

const sendEmail = (payload) => {
  const { templateUrl, logoUrl, userName, userEmail, subject, resetLink } =
    payload;

  const templateSource = fs.readFileSync(templateUrl, "utf-8");

  const template = handlebars.compile(templateSource);

  const replacements = {
    userName,
    resetLink,
    logoUrl,
  };

  // Generate HTML from template
  let htmlToSend = template(replacements);

  htmlToSend = juice(htmlToSend);

  const mailOptions = {
    from: "alhassanamin96@gmail.com",
    to: userEmail,
    subject: subject,
    html: htmlToSend,
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
