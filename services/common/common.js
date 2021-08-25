const db = require("../../models");

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
    return res.status(401).json({ message: err });
  }
};
