const db = require("../../models");
const https = require("https");
const sendEmail = require("../email/email");
const { lookup } = require("geoip-lite");
const { stream } = require("winston");

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

exports.getCompanyByUID = async (companyUID) => {
  try {
    const companyInfo = await db.Company.findOne({
      where: {
        companyUID: companyUID,
      },
      raw: true,
      attributes: ["companyId", "companyName", "companyUID"],
    });
    return companyInfo;
  } catch (error) {
    console.log(error.message);
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
  } catch (errors) {
    return { message: errors.message };
  }
};

exports.getStartDate = async (time) => {
  const currentDate = new Date();
  let startDate;
  time = time.toLowerCase();

  if (time === "day") {
    startDate = new Date(
      new Date() - new Date().getTimezoneOffset()
    ).toLocaleDateString();
  }

  if (time === "week") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 7)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }

  if (time === "month") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 30)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }

  if (time === "3months") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 90)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }

  if (time === "6months") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 180)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }

  if (time === "9months") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 270)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }

  if (time === "year") {
    startDate = new Date(
      new Date(currentDate.setDate(currentDate.getDate() - 365)).setUTCHours(
        0,
        0,
        0,
        0
      )
    ).toISOString();
  }
  console.log(startDate);
  return startDate;
};

exports.getUserLocationData = async (ipAddress) => {
  const location = lookup(ipAddress);
  const locationData = {
    ipAddress: ipAddress,
    //range: `${location && location.range[0]} - ${location && location.range[1]}`,
    country: location ? location.country : "-",
    timezone: location ? location.timezone : "-",
    city: location ? location.city : "-",
    state: location ? location.region : "-",
    longitude: location ? location.ll[0] : "-",
    latitude: location ? location.ll[1] : "-",
  };

  return locationData;
};

exports.getLastWeekDays = async (target) => {
  //target 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thurday, 5 = Friday
  // Returns ISOString Format 2021-10-20T14:12:39.779Z'
  let date = new Date();
  return new Date(
    date.setDate(
      date.getDate() -
        (date.getDay() == target ? 7 : (date.getDay() + (7 - target)) % 7)
    )
  ).toISOString();
};

exports.harvestTimeEntryData = async (pageNumber) => {
  var responses = [];
  var completed_requests = 0;

  const options = {
    protocol: "https:",
    hostname: "api.harvestapp.com",
    //path: "/v2/time_entries?page=" + pageNumber,
    headers: {
      "User-Agent": "Node.js Harvest API Sample",
      Authorization: "Bearer " + process.env.HARVEST_ACCESS_TOKEN,
      "Harvest-Account-ID": process.env.HARVEST_ACCOUNT_ID,
    },
  };

  for (var i = 1; i <= pageNumber; i++) {
    options.path = "/v2/time_entries?page=" + i;
    https.get(options, function (res) {
      res.on("data", function (chunk) {
        responses.push(chunk);
      });
      completed_requests++;
      res.on("end", function () {
        if (i == pageNumber) {
          // All downloads are completed
          let rawData = responses.join();
          let parsedData = JSON.parse(rawData);
          console.log("body:", parsedData);
          return parsedData;
        }
      });
    });
  }
};

exports.getUserRole = async (userId) => {
  const options = {
    protocol: "https:",
    hostname: "api.harvestapp.com",
    path: "/v2/users/" + userId,
    headers: {
      "User-Agent": "Node.js Harvest API Sample",
      Authorization: "Bearer " + process.env.HARVEST_ACCESS_TOKEN,
      "Harvest-Account-ID": process.env.HARVEST_ACCOUNT_ID,
    },
  };

  https
    .get(options, function (res) {
      const { statusCode } = res;

      if (statusCode !== 200) {
        console.error(`Request failed with status: ${statusCode}`);
        return;
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", function (chunk) {
        rawData += chunk;
      });

      res.on("end", function () {
        let parsedData = JSON.parse(rawData);
        return parsedData;
      });
    })
    .on("error", (e) => {
      console.error(`Got error: ${e.message}`);
    });
};

exports.makeHTTPRequest = (options) => {
  https.get(options, function (res) {
    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => {
      rawData += chunk;
    });

    res.on("end", () => {
      let parsedData = JSON.parse(rawData);
      return parsedData;
    });
  });
};

exports.isDateWithinRange = (value) => {
  // format: YYYY-MM-DD
  if (value === undefined) {
    return true;
  }
  value = value.split("-");
  var date = new Date();
  var lastDayOfTheMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0),
    firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  date = new Date(value[0], value[1] - 1, value[2]);

  return firstDayOfTheMonth <= date && date <= lastDayOfTheMonth;
};
