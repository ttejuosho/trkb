const { roles } = require("./role");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/signin");
};

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

exports.authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication failed!" });
};

exports.grantAccess = (role, action, resource) => {
  const permission = roles.can(role)[action](resource);
  if (!permission.granted) {
    return res.status(401).json({
      error: "You don't have enough permission to perform this action",
    });
  }
  return true;
};
