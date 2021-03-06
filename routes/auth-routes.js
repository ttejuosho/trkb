const authController = require('../controllers/auth_controller.js');
const {check} = require('express-validator');
const Security = require('../services/security/security.js');

module.exports = function(app) {
    app.get("/register", authController.getCompanyRegistrationPage);
    app.get("/signin", authController.getSigninPage);
    app.get("/signout", authController.signout);
    app.get("/signup", authController.getSignupPage);
    app.get("/iForgot", authController.getiForgotPage);
    app.post("/iForgot",     
    [
        check("emailAddress")
          .not()
          .isEmpty()
          .withMessage("Please enter your email address"),
    ], authController.sendPasswordResetEmail);

    app.post(
      "/passwordreset/:token",
      [
        check("newPassword")
          .not()
          .isEmpty()
          .withMessage("Please enter your new password"),
        check("confirmPassword")
          .not()
          .isEmpty()
          .withMessage("Please confirm your new password"),
      ], authController.passwordReset);

    app.get("/passwordreset/:token", authController.getPasswordResetPage);

    app.post('/resetPassword', 
    [
      check("newPassword")
        .not()
        .isEmpty()
        .withMessage("Please enter your new password"),
      check("confirmPassword")
        .not()
        .isEmpty()
        .withMessage("Please confirm your new password"),
    ], authController.ResetPassword);

    app.post("/signup", 
    [
        check('name').not().isEmpty().escape().withMessage('Name is required'),
        check('emailAddress').not().isEmpty().escape().withMessage('Email is required'),
        check('phoneNumber').not().isEmpty().escape().withMessage('Phone number is required'),
        check('locationUID').not().isEmpty().escape().withMessage('Location is required')
    ], authController.signup);
    
    app.post("/signin", authController.signin);
    app.post("/updateUserDetails", authController.updateUserDetails);
    app.post("/register", [ check('companyName').not().isEmpty().escape().withMessage('Company Name is required')], authController.newCompany);
    app.get("/newLocation", Security.isLoggedIn ,authController.getNewLocationPage);
    app.post("/newLocation", [ check('locationName').not().isEmpty().escape().withMessage('Location Name is required')], authController.newLocation);
}