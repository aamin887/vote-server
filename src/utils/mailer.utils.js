const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const mailerConfig = require("../config/mail.config.json");
const handlebars = require("handlebars");
const fs = require("fs");
const juice = require("juice");

class Mailer {
  constructor({ service, host, port, secure, user, pass }) {
    this.transporter = nodemailer.createTransport({
      service,
      host,
      port,
      secure,
      auth: { user, pass: process.env.EMAIL_PASSWORD },
    });
  }

  // methods for sending Text here
  async sendTextMail({ ...options }) {
    const mailOptions = { ...options };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      throw err;
    }
  }

  // methods for sending HTML here
  async sendHtmlMail({ ...options }) {
    console.log(options);

    const templateSource = fs.readFileSync(options.template, "utf-8");
    const template = handlebars.compile(templateSource);

    const replacements = {
      ...options.replacements,
    };

    let htmlToSend = template(replacements);
    htmlToSend = juice(htmlToSend);

    const mailOptions = {
      ...options,
      html: htmlToSend,
    };

    console.log(mailOptions);

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      throw err;
    }
  }
}

// initial Mailer class
const mailerInstance = new Mailer(mailerConfig);

module.exports = {
  mailerInstance,
  Mailer,
};

// structure of argments for sendHtmlMail method
// {
//   from: "alhassanamin96@gmail.com",
//   to: "forkahamin@yahoo.co.uk",
//   subject: "message",
//   text: "<h1>Hello</h1>",
//   replacements: {
//     name: 'amin',
//     resetLink: 'http://reset-password.com//token/expiry'
//   }
// }
