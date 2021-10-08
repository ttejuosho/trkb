const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendSMS = (to, body) => {
  client.messages
    .create({ body: body, from: process.env.FROM_SMS_NUMBER, to: to })
    .then((message) => {
      console.log(message.sid);
      return message.sid;
    });
};

module.exports = sendSMS;
