var express = require("express");
var app = express();
const cors = require("cors");
var db = require("./models");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
const moment = require("moment");
const helmet = require("helmet");
const cookieParser = require(`cookie-parser`);
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const winston = require("./services/winston/winston");
const path = require("path");
require("dotenv").config();

// cors setup
app.use(cors());
app.use(helmet());
app.options("*", cors());

// Enable before deployment to Heroku
//app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use("/api/", apiLimiter);

// Logger uncomment next line to enable winston
app.use(morgan("combined", { stream: winston.stream }));
//app.use(morgan("dev"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.use(cookieParser());
var exphbs = require("express-handlebars");

// For Passport
app.use(
  session({
    secret: "alakori somebodi",
    resave: true,
    saveUninitialized: false,
    cookie: {},
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

const hbs = exphbs.create({
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    ifIncludes: function (arg1, arg2, options) {
      return arg1.includes(arg2) ? options.fn(this) : options.inverse(this);
    },
    counter: function (value, options) {
      return parseInt(value) + 1;
    },
    getLength: function (obj) {
      return obj.length;
    },
    increment: function (value, options) {
      let c = 0;
      return (c += 1);
    },
    formatDate: function (value) {
      if (value && moment(value).isValid()) {
        var f = "MMM Do, YYYY";
        return moment(value).format(f);
      } else {
        return value; // moment plugin is not available, value does not have a truthy value, or value is not a valid date
      }
    },
    formatDateTime: function (value) {
      if (value && moment(value).isValid()) {
        var f = "MMMM Do YYYY, h:mm a";
        return moment(value).format(f);
      } else {
        return value; // moment plugin is not available, value does not have a truthy value, or value is not a valid date
      }
    },
    eachProperty: function (context, options) {
      var ret = "";
      for (var prop in context) {
        ret = ret + options.fn({ property: prop, value: context[prop] });
      }
      return ret;
    },
  },
  defaultLayout: "main",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use((req, res, next) => {
  if (req.isAuthenticated) {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.user !== undefined) {
      res.locals.userId = req.user.userId;
      res.locals.name = req.user.name;
      res.locals.emailAddress = req.user.emailAddress;
      res.locals.phoneNumber = req.user.phoneNumber;
      res.locals.companyUID = req.user.companyUID;
      res.locals.locationUID = req.user.locationUID;
      res.locals.role = req.user.role;
    }
  }
  next();
});

require(path.join(__dirname, "./routes/api-routes.js"))(app);
require(path.join(__dirname, "./routes/finrec-routes.js"))(app);
require(path.join(__dirname, "./routes/auth-routes.js"))(app);

// load passport strategies
require(path.join(__dirname, "./services/passport/passport.js"))(
  passport,
  db.User
);

module.exports = app;
