const db = require("../../models");
const sendEmail = require("../email/email");
const bCrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

exports.validateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return true;
  }
  return false;
};

exports.getCompanyNamebyUID = async (companyUID) => {
  try {
    const cc = await db.Company.findOne({
      where: {
        companyUID: companyUID,
      },
      raw: true,
      attributes: ["companyName"],
    });
    return cc.companyName;
  } catch (err) {
    console.log(err);
  }
};

exports.getLocationNamebyUID = async (locationUID) => {
  try {
    if (!locationUID) {
      throw "LocationUID is undefined";
    }
    const cc = await db.Location.findOne({
      where: {
        locationUID: locationUID,
      },
      raw: true,
      attributes: ["locationName"],
    });
    return cc.locationName;
  } catch (err) {
    console.log(err);
  }
};

exports.getCompanyLocations = async (companyUID) => {
  try {
    if (!companyUID) {
      throw "CompanyUID is undefined";
    }
    const cc = await db.Location.findAll({
      where: {
        companyUID: companyUID,
      },
      raw: true,
      attributes: ["locationName", "locationUID", "companyUID"],
    });
    return cc;
  } catch (err) {
    console.log(err);
    return { message: err };
  }
};

exports.sendNewAccountPasswordResetEmail = async (
  firstName,
  managerName,
  companyName,
  emailAddress,
  token
) => {
  try {
    const emailSubject = "Your New ToroKobo Account";
    const emailBody = `
    <p>Hello ${firstName},</p>
    <p>Your Account has been set up.</p>
    <p>Click <a href="https://trkb.herokuapp.com/passwordreset/${token}">here to reset your password</a> to begin.</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <p>${managerName}<p>
    <span style="font-size: 1rem;color: black;"><strong>${companyName}</strong></span>
    `;

    await sendEmail(companyName, emailBody, emailSubject, emailAddress);
  } catch (err) {
    return { message: err };
  }
};

exports.getStartDate = async (time) => {
  const currentDate = new Date();
  let startDate;
  time = time.toLowerCase();

  if (time === "day") {
    startDate = new Date().getDay();
  }

  if (time === "week") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 7)
    ).toISOString();
  }

  if (time === "month") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 30)
    ).toISOString();
  }

  if (time === "3months") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 90)
    ).toISOString();
  }

  if (time === "6months") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 180)
    ).toISOString();
  }

  if (time === "9months") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 270)
    ).toISOString();
  }

  if (time === "year") {
    startDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 365)
    ).toISOString();
  }

  return startDate;
};
