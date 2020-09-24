const finRecController = require("../controllers/finrec_controller.js");
const { check } = require("express-validator");
const Security = require("../services/security/security.js");

module.exports = function (app) {
  app.get("/api/health", finRecController.CheckApi);
  app.get("/", Security.isLoggedIn, finRecController.GetHomePage);

  app.get(
    "/transaction/new",
    Security.isLoggedIn,
    finRecController.GetNewTransactionForm
  );
  app.post(
    "/transaction/new",
    [
      check("transactionTerminal")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Please choose a transaction terminal"),
      check("transactionType")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Please choose a transaction type"),
      check("amountReceived")
        .not()
        .isEmpty()
        .escape()
        .isNumeric()
        .withMessage("Amount received error"),
      check("amountPaid")
        .not()
        .isEmpty()
        .escape()
        .isNumeric()
        .withMessage("Please enter amount paid"),
      check("transactionCharge")
        .not()
        .isEmpty()
        .isNumeric()
        .escape()
        .withMessage("Please enter amount charged"),
      check("posCharge")
        .not()
        .isEmpty()
        .isNumeric()
        .escape()
        .withMessage("POS Charge error"),
    ],
    Security.isLoggedIn,
    finRecController.SaveNewTransaction
  );

  app.get(
    "/transaction/detail/:transactionUID",
    Security.isLoggedIn,
    finRecController.GetTransactionDetails
  );

  app.post(
    "/search",
    [
      check("searchQuery")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Enter a valid search term"),
    ],
    Security.isLoggedIn,
    finRecController.search
  );

  app.get("/profile", Security.isLoggedIn, finRecController.GetProfilePage);
  app.get("/settings", Security.isLoggedIn, finRecController.GetSettingsPage);
  app.post(
    "/updateCompanyInfo",
    [
      check("companyName")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Company name is required"),
      check("companyEmail")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Email is required"),
      check("companyAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Address is required"),
      check("companyCity")
        .not()
        .isEmpty()
        .escape()
        .withMessage("City is required"),
      check("companyState")
        .not()
        .isEmpty()
        .escape()
        .withMessage("State is required"),
      check("companyPhone")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Phone number is required"),
    ],
    Security.isLoggedIn,
    finRecController.UpdateCompanyInfo
  );
};
