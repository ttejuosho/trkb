const db = require("../models");
const passport = require("passport");
const { validationResult } = require("express-validator");
const bCrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const sendEmail = require("../services/email/email.js");
const { logThis } = require("../services/log/log.js");
const {
  getUserLocationData,
  getCompanyByUID,
} = require("../services/common/common");

// Render Signin page
exports.getSigninPage = async (req, res) => {
  await logThis(
    "INFO",
    "Unknown UserId",
    "Unknown Email",
    "Unknown CompanyUID",
    "Unknown LocationUID",
    "/signin",
    req.socket.remoteAddress,
    "authController.getSigninPage",
    "signin: true"
  );
  return res.render("auth/auth", {
    title: "Sign In",
    layout: "partials/prelogin",
    signin: true,
  });
};

// Render Signup page
exports.getSignupPage = (req, res) => {
  return res.render("auth/auth", {
    title: "Sign Up",
    layout: "partials/prelogin",
    signup: true,
    newRegistration: true,
  });
};

exports.getNewLocationPage = (req, res) => {
  return res.render("auth/auth", {
    title: "New Location",
    layout: "partials/prelogin",
    newLocation: true,
    companyUID: res.locals.companyUID,
  });
};

// Render Forgot Password page
exports.getiForgotPage = (req, res) => {
  return res.render("auth/auth", {
    title: "iForgot",
    layout: "partials/prelogin",
    iForgot: true,
  });
};

exports.getPasswordResetPage = (req, res) => {
  db.User.findOne({
    where: {
      resetPasswordToken: req.params.token,
    },
  }).then((dbUser) => {
    if (dbUser === null) {
      const errors = {
        iForgot: true,
        error: "Invalid password reset token, please request another one.",
        layout: "partials/prelogin",
      };
      return res.render("auth/auth", errors);
    }

    // Check if token matches
    if (
      !crypto.timingSafeEqual(
        Buffer.from(dbUser.dataValues.resetPasswordToken),
        Buffer.from(req.params.token)
      )
    ) {
      const hbsObject = {
        resetPassword: true,
        error: "Invalid password reset token, please request another one.",
        layout: "partials/prelogin",
      };
      return res.render("auth/auth", hbsObject);
    }
    // Check token expiration
    if (dbUser.dataValues.resetPasswordExpires < Date.now()) {
      const hbsObject = {
        resetPassword: true,
        error:
          "Your Password reset link has expired, please request another one.",
        layout: "partials/prelogin",
      };
      return res.render("auth/auth", hbsObject);
    }

    const hbsObject = {
      resetPassword: true,
      token: req.params.token,
      layout: "partials/prelogin",
    };
    return res.render("auth/auth", hbsObject);
  });
};

exports.getCompanyRegistrationPage = (req, res) => {
  return res.render("auth/auth", {
    title: "Register",
    layout: "partials/prelogin",
    companyRegistration: true,
  });
};

exports.newCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.companyName = req.body.companyName;
    errors.companyRegistration = true;
    errors.layout = "partials/prelogin";
    return res.render("auth/auth", errors);
  }
  var companyUID = Math.floor(Math.random() * 90000) + 10000;
  let checkCompany = await db.Company.findOne({
    where: {
      companyName: req.body.companyName,
    },
  });

  if (checkCompany == null) {
    db.Company.create({
      companyName: req.body.companyName,
      companyUID: companyUID,
    }).then((dbCompany) => {
      return res.render("auth/auth", {
        title: "Sign Up",
        layout: "partials/prelogin",
        newLocation: true,
        companyUID: companyUID,
        companyName: req.body.companyName,
      });
    });
  } else {
    return res.render("auth/auth", {
      title: "Register",
      layout: "partials/prelogin",
      companyRegistration: true,
      companyName: req.body.companyName,
      error: "Company already exists.",
    });
  }
};

exports.newLocation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.locationName = req.body.locationName;
    errors.newLocation = true;
    return res.render("auth/auth", errors);
  }
  var locationUID = Math.floor(Math.random() * 90000) + 10000;
  db.Location.findOne({
    where: {
      locationName: req.body.locationName,
    },
  }).then((dbLocation) => {
    if (dbLocation == null) {
      db.Location.create({
        locationUID: locationUID,
        companyUID: req.body.companyUID,
        locationName: req.body.locationName,
      }).then((dbLocation) => {
        if (req.body.action === "New Location") {
          return res.render("auth/auth", {
            layout: "partials/prelogin",
            newLocation: true,
            companyUID: req.body.companyUID,
            companyName: req.body.companyName,
          });
        } else {
          db.Location.findAll({
            where: {
              companyUID: req.body.companyUID,
            },
          }).then((dbLocation) => {
            var locations = [];
            for (var i = 0; i < dbLocation.length; i++) {
              locations.push(dbLocation[i].dataValues);
            }
            return res.render("auth/auth", {
              layout: "partials/prelogin",
              signup: true,
              newCompany: true,
              companyUID: req.body.companyUID,
              companyName: req.body.companyName,
              locations: locations,
            });
          });
        }
      });
    } else {
      return res.render("auth/auth", {
        title: "Sign Up",
        layout: "partials/prelogin",
        newLocation: true,
        companyUID: req.body.companyUID,
        companyName: req.body.companyName,
        error: "Location already exists.",
      });
    }
  });
};

exports.signup = (req, res, next) => {
  //Validate Company Id
  res.locals.locationUID = req.body.locationUID;
  db.Company.findOne({
    where: {
      companyUID: req.body.companyUID,
    },
  }).then((dbCompany) => {
    if (dbCompany == null) {
      return res.render("auth/auth", {
        signup: true,
        layout: "partials/prelogin",
        error: "Invalid Company Id",
        companyUID: req.body.companyUID,
        companyName: req.body.companyName,
        locationUID: req.body.locationUID,
        emailAddress: req.body.emailAddress,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        newCompany: false,
      });
    } else {
      req.session.userInfo = {};
      req.session.userInfo.companyUID = dbCompany.dataValues.companyUID;
      req.session.userInfo.companyName = req.body.companyName;
      //Check Password
      if (
        req.body.password.trim().length < 3 ||
        req.body.password.trim() !== req.body.confirmPassword.trim()
      ) {
        return res.render("auth/auth", {
          signup: true,
          layout: "partials/prelogin",
          error: "Password mismatch",
          companyUID: req.body.companyUID,
          companyName: req.body.companyName,
          locationUID: req.body.locationUID,
          emailAddress: req.body.emailAddress,
          name: req.body.name,
          newCompany: req.body.newCompany,
        });
      } else {
        // check if Email address exists
        db.User.findOne({
          where: {
            emailAddress: req.body.emailAddress,
          },
        }).then((dbUser) => {
          if (dbUser !== null) {
            return res.render("auth/auth", {
              signup: true,
              layout: "partials/prelogin",
              error:
                "Email is taken, Please use the password reset link or choose a new email",
              companyUID: req.body.companyUID,
              companyName: req.body.companyName,
              locationUID: req.body.locationUID,
              emailAddress: req.body.emailAddress,
              name: req.body.name,
              phoneNumber: req.body.phoneNumber,
              newCompany: req.body.newCompany,
            });
          } else {
            // Success
            passport.authenticate("local-signup", (err, user, info) => {
              if (err) {
                return next(err); // will generate a 500 error
              }
              if (!user) {
                const msg = {
                  error: "Sign Up Failed: Username already exists",
                  layout: "partials/prelogin",
                };
                return res.render("auth/auth", msg);
              }
              req.login(user, (signupErr) => {
                if (signupErr) {
                  const msg = {
                    error: "Sign up Failed",
                    layout: "partials/prelogin",
                  };
                  return res.render("auth/auth", msg);
                }
                req.session.userInfo = {};
                req.session.userInfo.companyId = req.body.companyUID;
                req.session.userInfo.companyName = req.body.companyName;
                res.redirect("/");
              });
            })(req, res, next);
          }
        });
      }
    }
  });
};

exports.signin = async (req, res, next) => {
  const locationData = await getUserLocationData(
    req.headers["x-forwarded-for"] || req.socket.remoteAddress
  );

  passport.authenticate("local-signin", function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }

    if (info && info.message.length > 1) {
      const msg = {
        error: info.message,
        layout: "partials/prelogin",
        signin: true,
      };
      return res.render("auth/auth", msg);
    }

    // User is boolean
    if (!user) {
      const msg = {
        error: "Your Username or Password is incorrect",
        layout: "partials/prelogin",
        signin: true,
      };
      return res.render("auth/auth", msg);
    }

    req.login(user, async (loginErr) => {
      if (loginErr) {
        const msg = {
          error: "Authentication Failed",
          layout: "partials/prelogin",
          signin: true,
        };
        return res.render("auth/auth", msg);
      }

      await logThis(
        "INFO",
        req.user.userId,
        req.user.emailAddress,
        req.user.companyUID,
        req.user.locationUID,
        "/signin",
        locationData.ipAddress,
        "AuthController.Signin called.",
        `${req.user.name} signed in at ${new Date().toLocaleString()}`
      );

      if (process.env.NODE_ENV !== "development") {
        let emailBody = `${
          req.user.name
        } signed in at ${new Date().toLocaleString()}`;
        sendEmail(
          "TrKB Financials",
          emailBody,
          "New Login Notification",
          "theycallmeflowz@yahoo.com"
        );
      }

      const companyInfo = await getCompanyByUID(user.companyUID);

      req.session.userInfo = {};
      req.session.userInfo.companyId = companyInfo.companyId;
      req.session.userInfo.companyUID = companyInfo.companyUID;
      req.session.userInfo.companyName = companyInfo.companyName;
      req.session.userInfo.ipAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      req.session.userInfo.userLocationCity = locationData.city;
      req.session.userInfo.userLocationState = locationData.state;

      return res.redirect("/");
    });
  })(req, res, next);
};

exports.sendPasswordResetEmail = (req, res) => {
  const token = crypto.randomBytes(20).toString("hex");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.layout = "partials/prelogin";
    errors.iForgot = true;
    return res.render("auth/auth", errors);
  }

  db.User.findOne({
    where: {
      emailAddress: req.body.emailAddress,
    },
  }).then((dbUser) => {
    if (dbUser === null) {
      const errors = {
        iForgot: true,
        error: "Email not found",
        layout: "partials/prelogin",
      };
      return res.render("auth/auth", errors);
    }
    const userInfo = {
      name: dbUser.dataValues.name,
      emailAddress: dbUser.dataValues.emailAddress,
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    };

    const subject = "Reset Your ToroKobo Password";
    const emailBody = `
          <p>Hello ${userInfo.name},</p>
          <p style="color: black;">Ready to reset your password ?.</p>    
          <p>Click <a href="https://trkb.herokuapp.com/passwordreset/${token}">Reset now</a> to begin.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <span style="font-size: 1rem;color: black;"><strong>Kowope Enterprises.</strong></span>
          `;

    logThis(
      "INFO",
      res.locals.userId,
      res.locals.emailAddress,
      res.locals.companyUID,
      res.locals.locationUID,
      "authController/sendPasswordResetEmail",
      req.socket.remoteAddress,
      `Password Reset email sent to ${userInfo.emailAddress}`,
      `Token ${token}, Expires at ${new Date(
        userInfo.resetPasswordExpires
      ).toLocaleString()}`
    );

    return new Promise((resolve, reject) => {
      sendEmail("TrKB Financials", emailBody, subject, userInfo.emailAddress);
      db.User.update(
        {
          resetPasswordExpires: userInfo.resetPasswordExpires,
          resetPasswordToken: userInfo.resetPasswordToken,
        },
        {
          where: {
            userId: dbUser.dataValues.userId,
          },
        }
      );
      const message = {
        iForgot: true,
        error: "Password reset email has been sent to " + userInfo.emailAddress,
        layout: "partials/prelogin",
      };
      return res.render("auth/auth", message);
    });
  });
};

exports.passwordReset = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    (errors.resetPassword = true), (errors.token = req.params.token);
    errors.layout = "partials/prelogin";
    return res.render("auth/auth", errors);
  } else if (req.body.newPassword !== req.body.confirmPassword) {
    const hbsObject = {
      resetPassword: true,
      token: req.params.token,
      error: "Passwords dont match",
      layout: "partials/prelogin",
    };
    return res.render("auth/auth", hbsObject);
  } else {
    db.User.findOne({
      where: {
        resetPasswordToken: req.params.token,
      },
    }).then((dbUser) => {
      if (dbUser === null) {
        const errors = {
          resetPassword: true,
          error: "Email not found",
          layout: "partials/prelogin",
        };
        return res.render("auth/auth", errors);
      }
      if (
        dbUser.dataValues.resetPasswordExpires > Date.now() &&
        crypto.timingSafeEqual(
          Buffer.from(dbUser.dataValues.resetPasswordToken),
          Buffer.from(req.params.token)
        )
      ) {
        const userPassword = bCrypt.hashSync(
          req.body.newPassword,
          bCrypt.genSaltSync(8),
          null
        );
        db.User.update(
          {
            resetPasswordExpires: null,
            resetPasswordToken: null,
            password: userPassword,
          },
          {
            where: {
              userId: dbUser.dataValues.userId,
            },
          }
        );
        const name = dbUser.dataValues.name;
        const subject = "Your Torokobo Password has changed";
        const emailBody = `
              <p>Hello ${name},</p>
              <p style="color: black;">Your password has been successfully reset.</p>    
              <p>Click <a href="https://trkb.herokuapp.com/signin">here to Log In</a>.</p>
              <span style="font-size: 1rem;color: black;"><strong>TrKB Inc.</strong></span>`;
        return new Promise((resolve, reject) => {
          sendEmail(null, emailBody, subject, dbUser.dataValues.emailAddress);
          return res.redirect("/signin");
        });
      }
    });
  }
};

exports.ResetPassword = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.resetPasswordError = true;
    return res.render("profile", errors);
  } else if (req.body.newPassword !== req.body.confirmPassword) {
    const hbsObject = {
      resetPasswordError: true,
      error: "Passwords dont match",
      companyUID: res.locals.companyUID,
      locationUID: res.locals.locationUID,
      name: res.locals.name,
      emailAddress: res.locals.emailAddress,
      phoneNUmber: res.locals.phoneNumber,
    };

    return res.render("profile", hbsObject);
  } else {
    const userPassword = bCrypt.hashSync(
      req.body.newPassword,
      bCrypt.genSaltSync(8),
      null
    );
    db.User.update(
      { password: userPassword },
      {
        where: {
          userId: res.locals.userId,
        },
      }
    );
    const name = res.locals.name;
    const subject = "Your TrKB Password has changed";
    const emailBody = `
          <p>Hello ${name},</p>
          <p style="color: black;">Your password has been successfully reset.</p>    
          <p>Click <a href="https://trkb.herokuapp.com/signin">here to Log In</a>.</p>
          <span style="font-size: 1rem;color: black;"><strong>TrKB Inc.</strong></span>`;
    return new Promise((resolve, reject) => {
      sendEmail(null, emailBody, subject, res.locals.emailAddress);
      return res.redirect("/profile");
    });
  }
};

exports.signout = async (req, res) => {
  await logThis(
    "INFO",
    res.locals.userId,
    res.locals.emailAddress,
    res.locals.companyUID,
    res.locals.locationUID,
    "/signout",
    "AuthController.Signout called.",
    `${res.locals.name} signed out at ${new Date().toLocaleString()}`
  );
  req.session.destroy(function (err) {
    res.redirect("/signin");
  });
};

exports.updateUserDetails = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.name = req.body.name;
    errors.emailAddress = req.body.emailAddress;
    errors.phoneNumber = req.body.phoneNumber;
    return res.render("profile", errors);
  }

  db.User.update(
    {
      name: req.body.name,
      emailAddress: req.body.emailAddress,
      phoneNUmber: req.body.phoneNumber,
    },
    {
      where: { userId: res.locals.userId },
    }
  ).then((dbUser) => {
    return res.redirect("/profile");
  });
};
