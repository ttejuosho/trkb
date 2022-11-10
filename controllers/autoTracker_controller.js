const db = require("../models");
const { validationResult } = require("express-validator");

exports.GetNewCustomerForm = (req, res) => {
  return res.render("newCustomer", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.GetNewTrackerForm = (req, res) => {
  return res.render("newTracker", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
    customerId: req.params.customerId,
  });
};

exports.GetEditCustomerForm = (req, res) => {
  db.Customer.findOne({
    where: {
      customerId: req.params.customerId,
    },
    raw: true,
  }).then((dbCustomer) => {
    dbCustomer.edit = true;
    return res.render("newCustomer", dbCustomer);
  });
};

exports.GetCustomersPage = (req, res) => {
  return res.render("customers");
};

exports.GetCustomerPage = (req, res) => {
  db.Customer.findOne({
    where: {
      customerId: req.params.customerId,
    },
    raw: true,
  }).then((dbCustomer) => {
    return res.render("customer", dbCustomer);
  });
};

exports.CreateNewCustomer = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.customerExternalId = req.body.customerExternalId;
    errors.customerName = req.body.customerName;
    errors.customerEmail = req.body.customerEmail;
    errors.customerPhone = req.body.customerPhone;
    errors.ipAddress = req.body.ipAddress;
    errors.expiresOn = req.body.expiresOn;
    errors.registeredOn = req.body.registeredOn;
    errors.lastLoginDate = req.body.lastLoginDate;
    errors.privilege = req.body.privilege;
    errors.active = req.body.active;
    return res.render("newCustomer", errors);
  }
  db.Customer.create({
    customerName: req.body.customerName,
    customerExternalId: req.body.customerExternalId,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    ipAddress: req.body.ipAddress,
    expiresOn: new Date(req.body.expiresOn).toLocaleDateString(),
    registeredOn: new Date(req.body.registeredOn).toLocaleDateString(),
    lastLoginDate: new Date(req.body.lastLoginDate).toLocaleDateString(),
    privilege: req.body.privilege,
    active: req.body.active === "Yes" ? 1 : 0,
  }).then((dbCustomer) => {
    return res.render("newCustomer", {
      customerCreated: true,
      customerId: dbCustomer.dataValues.customerId,
      companyName: req.session.userInfo.companyName,
      companyId: req.session.userInfo.companyId,
    });
  });
};

exports.UpdateCustomerData = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.customerName = req.body.customerName;
    errors.customerExternalId = req.body.customerExternalId;
    errors.customerEmail = req.body.customerEmail;
    errors.customerPhone = req.body.customerPhone;
    errors.ipAddress = req.body.ipAddress;
    return res.render("newCustomer", errors);
  }
  db.Customer.update(
    {
      customerName: req.body.customerName,
      customerExternalId: req.body.customerExternalId,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      ipAddress: req.body.ipAddress,
      expiresOn: new Date(req.body.expiresOn).toLocaleDateString(),
      registeredOn: new Date(req.body.registeredOn).toLocaleDateString(),
      lastLoginDate: new Date(req.body.lastLoginDate).toLocaleDateString(),
      privilege: req.body.privilege,
      active: req.body.active === "Yes" ? 1 : 0,
    },
    {
      where: {
        customerId: req.params.customerId,
      },
    }
  ).then((dbCustomer) => {
    res.redirect("/autoTracker/customers");
  });
};

exports.CreateNewTracker = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.vehicleYear = req.body.vehicleYear;
    errors.vehicleMake = req.body.vehicleMake;
    errors.vehicleModel = req.body.vehicleModel;
    errors.licensePlateNumber = req.body.licensePlateNumber;
    errors.imei = req.body.imei;
    errors.gpsDevice = req.body.gpsDevice;
    errors.simCardNumber = req.body.simCardNumber;
    errors.ipAddress = req.body.ipAddress;
    errors.port = req.body.port;
    errors.protocol = req.body.protocol;
    errors.netProtocol = req.body.netProtocol;
    errors.lastConnectionDate = req.body.lastConnectionDateValue;
    errors.expiresOn = req.body.expiresOnValue;
    errors.customerId = req.params.customerId;
    return res.render("newTracker", errors);
  }
  db.Tracker.create({
    customerId: req.body.customerId,
    vehicleYear: req.body.vehicleYear,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    licensePlateNumber: req.body.licensePlateNumber,
    imei: req.body.imei,
    gpsDevice: req.body.gpsDevice,
    simCardNumber: req.body.simCardNumber,
    ipAddress: req.body.ipAddress,
    port: req.body.port,
    protocol: req.body.protocol,
    netProtocol: req.body.netProtocol,
    expiresOn: new Date(req.body.expiresOn).toLocaleDateString(),
    lastConnectionDate: new Date(
      req.body.lastConnectionDate
    ).toLocaleDateString(),
  }).then((dbTracker) => {
    return res.redirect("/autoTracker/customer/" + req.params.customerId);
  });
};

exports.GetEditTrackerForm = (req, res) => {
  db.Tracker.findOne({
    where: {
      trackerId: req.params.trackerId,
    },
    raw: true,
  }).then((dbTracker) => {
    dbTracker.edit = true;
    return res.render("newTracker", dbTracker);
  });
};

exports.UpdateTrackerData = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.vehicleYear = req.body.vehicleYear;
    errors.vehicleMake = req.body.vehicleMake;
    errors.vehicleModel = req.body.vehicleModel;
    errors.licensePlateNumber = req.body.licensePlateNumber;
    errors.imei = req.body.imei;
    errors.gpsDevice = req.body.gpsDevice;
    errors.simCardNumber = req.body.simCardNumber;
    errors.ipAddress = req.body.ipAddress;
    errors.port = req.body.port;
    errors.protocol = req.body.protocol;
    errors.netProtocol = req.body.netProtocol;
    errors.lastConnectionDate = req.body.lastConnectionDateValue;
    errors.expiresOn = req.body.expiresOnValue;
    errors.customerId = req.body.customerId;
    return res.render("newTracker", errors);
  }
  db.Tracker.update(
    {
      customerId: req.body.customerId,
      vehicleYear: req.body.vehicleYear,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      licensePlateNumber: req.body.licensePlateNumber,
      imei: req.body.imei,
      gpsDevice: req.body.gpsDevice,
      simCardNumber: req.body.simCardNumber,
      ipAddress: req.body.ipAddress,
      port: req.body.port,
      protocol: req.body.protocol,
      netProtocol: req.body.netProtocol,
      expiresOn: new Date(req.body.expiresOn).toLocaleDateString(),
      lastConnectionDate: new Date(
        req.body.lastConnectionDate
      ).toLocaleDateString(),
    },
    {
      where: {
        trackerId: req.params.trackerId,
      },
    }
  ).then((dbTracker) => {
    return res.redirect("/autoTracker/customer/" + req.body.customerId);
  });
};
