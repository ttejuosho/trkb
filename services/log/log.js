const db = require("../../models");
const { getUserLocationData } = require("../common/common.js");

exports.logThis = async (
  level,
  userId,
  emailAddress,
  companyUID,
  locationUID,
  apiEndpoint,
  ipAddress,
  action,
  notes
) => {
  const locationData = await getUserLocationData(ipAddress);
  db.Log.create({
    notes: notes,
    userId: userId,
    emailAddress: emailAddress,
    time: new Date().toLocaleString(),
    companyUID: companyUID,
    locationUID: locationUID,
    level: level,
    apiEndpoint: apiEndpoint,
    ipAddress: ipAddress,
    location: `${locationData.city}, ${locationData.state}, ${locationData.country}`,
    action: action,
    notes: notes,
  });
};
