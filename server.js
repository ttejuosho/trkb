var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
const moment = require("moment");
// bring in the models
var db = require("./models");
const cors = require("cors");
var app = express();
const http = require("http").createServer(app);
const helmet = require("helmet");
const cookieParser = require(`cookie-parser`);
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();

// cors setup
app.use(cors());
app.use(helmet());
app.options("*", cors());

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

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
      ifEquals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
      ifIncludes: function(arg1, arg2, options) {
        return (arg1.includes(arg2)) ? options.fn(this) : options.inverse(this);
      },
      counter: function(value, options) {
        return parseInt(value) + 1;
      },
      getLength: function(obj) {
        return obj.length;
      },
      increment: function(value, options) {
        let c = 0;
        return c += 1;
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
          var f = "MMM Do, YYYY HH:mm a";
          return moment(value).format(f);
        } else {
          return value; // moment plugin is not available, value does not have a truthy value, or value is not a valid date
        }
      },
    },
    defaultLayout: 'main',
  });
  
  app.engine('handlebars', hbs.engine);

app.set("view engine", "handlebars");

app.use((req, res, next) => {
  // add this line to include winston logging uncomment next line to enable winston
  // winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (req.isAuthenticated) {
    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.user !== undefined){
      res.locals.userId = req.user.userId;
      res.locals.name = req.user.name;
      res.locals.emailAddress = req.user.emailAddress;
      res.locals.phoneNumber = req.user.phoneNumber;
      res.locals.companyUID = req.user.companyUID;
      res.locals.companyId = req.user.CompanyCompanyId;
    }
  }
  next();
});

require("./routes/api-routes")(app);
require("./routes/finrec-routes")(app);
require("./routes/auth-routes")(app);


// load passport strategies
require("./services/passport/passport.js")(passport, db.User);



const port = process.env.PORT || 3000;
db.sequelize.sync().then(function() {
  http.listen(port);
}).catch(function (err) {
    console.log(err, "Oh no !! Something went wrong with the Database!");
  });