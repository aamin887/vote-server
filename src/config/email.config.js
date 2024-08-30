require("dotenv").config();
const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alhassanamin96@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = emailTransporter;
