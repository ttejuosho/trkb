const authController = require('../controllers/auth-controller');
const {check} = require('express-validator');

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
        ],
        authController.resetPassword
      );
    app.get("/passwordreset/:token", authController.getResetPasswordPage);
    app.post("/signup", 
    [
        check('name').not().isEmpty().escape().withMessage('Name is required'),
        check('emailAddress').not().isEmpty().escape().withMessage('Email is required'),
        check('phoneNumber').not().isEmpty().escape().withMessage('Phone number is required')
    ],
    authController.signup);
    app.post("/signin", authController.signin);
    app.post("/register", [ check('companyName').not().isEmpty().escape().withMessage('Company Name is required')], authController.newCompany);
}