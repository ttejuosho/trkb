const nodemailer = require("nodemailer");

const sendEmail = (companyName, emailBody, subject, recipients) => {
  const transporter = nodemailer.createTransport({
    service: "AOL",
    auth: {
      user: process.env.EMAIL_ADDRESS, // user email
      pass: process.env.EMAIL_PASSWORD, // password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from:
      (companyName == null ? "TrKb Inc" : companyName) +
      "<" +
      process.env.EMAIL_ADDRESS +
      ">", // sender address
    to: recipients, // list of receivers
    subject: subject, // Subject line
    // text: 'Hello world?', // plain text body
    html: emailBody, // html body
    // template: 'templates/surveynotification'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Message ID: %s", info.messageId);
      console.log("Email Has Been Sent to: ", info.envelope.to.toString());
    }
  });
};

module.exports = sendEmail;
