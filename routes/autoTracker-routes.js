const autoTrackerController = require("../controllers/autoTracker_controller.js");
const { check } = require("express-validator");
const Security = require("../services/security/security.js");

module.exports = function (app) {
  app.get(
    "/autotracker/newCustomer",
    Security.isLoggedIn,
    autoTrackerController.GetNewCustomerForm
  );

  app.get(
    "/autotracker/tracker/new/:customerId",
    Security.isLoggedIn,
    autoTrackerController.GetNewTrackerForm
  );

  app.get(
    "/autotracker/customers",
    Security.isLoggedIn,
    autoTrackerController.GetCustomersPage
  );

  app.get(
    "/autotracker/customer/:customerId",
    Security.isLoggedIn,
    autoTrackerController.GetCustomerPage
  );

  app.get(
    "/autotracker/customer/edit/:customerId",
    Security.isLoggedIn,
    autoTrackerController.GetEditCustomerForm
  );

  app.post(
    "/autoTracker/customer/new",
    [
      check("customerExternalId")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Customer Id is required"),
      check("customerName")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Customer name is required"),
      check("customerEmail")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Email Address is required"),
      check("customerPhone")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Phone Number is required"),
      check("ipAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("IP Address is required"),
    ],
    Security.isLoggedIn,
    autoTrackerController.CreateNewCustomer
  );

  app.post(
    "/autoTracker/customer/edit/:customerId",
    [
      check("customerName")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Customer name is required"),
      check("customerEmail")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Email Address is required"),
      check("customerPhone")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Phone Number is required"),
      check("ipAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("IP Address is required"),
    ],
    Security.isLoggedIn,
    autoTrackerController.UpdateCustomerData
  );

  app.post(
    "/autoTracker/tracker/new/:customerId",
    [
      check("vehicleYear")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Year is required"),
      check("vehicleMake")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Make is required"),
      check("vehicleModel")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Model is required"),
      check("licensePlateNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("License # is required"),
      check("imei").not().isEmpty().escape().withMessage("IMEI is required"),
      check("gpsDevice")
        .not()
        .isEmpty()
        .escape()
        .withMessage("GPS Device is required"),
      check("simCardNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Sim Card Number is required"),
      check("ipAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("IP Address is required"),
      check("port").not().isEmpty().escape().withMessage("Port is required"),
      check("protocol")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Protocol is required"),
      check("netProtocol")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Net Protocol is required"),
      check("expiresOn")
        .not()
        .isEmpty()
        .withMessage("Expiration Date is required"),
      check("lastConnectionDate")
        .not()
        .isEmpty()
        .withMessage("Last Connection Date is required"),
    ],
    Security.isLoggedIn,
    autoTrackerController.CreateNewTracker
  );

  app.get(
    "/autotracker/tracker/edit/:trackerId",
    Security.isLoggedIn,
    autoTrackerController.GetEditTrackerForm
  );

  app.post(
    "/autoTracker/tracker/edit/:trackerId",
    [
      check("vehicleYear")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Year is required"),
      check("vehicleMake")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Make is required"),
      check("vehicleModel")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Vehicle Model is required"),
      check("licensePlateNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("License # is required"),
      check("imei").not().isEmpty().escape().withMessage("IMEI is required"),
      check("gpsDevice")
        .not()
        .isEmpty()
        .escape()
        .withMessage("GPS Device is required"),
      check("simCardNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Sim Card Number is required"),
      check("ipAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("IP Address is required"),
      check("port").not().isEmpty().escape().withMessage("Port is required"),
      check("protocol")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Protocol is required"),
      check("netProtocol")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Net Protocol is required"),
      check("expiresOn")
        .not()
        .isEmpty()
        .withMessage("Expiration Date is required"),
      check("lastConnectionDate")
        .not()
        .isEmpty()
        .withMessage("Last Connection Date is required"),
    ],
    Security.isLoggedIn,
    autoTrackerController.UpdateTrackerData
  );
};
