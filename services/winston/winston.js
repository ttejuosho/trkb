const appRoot = require("app-root-path");
const winston = require("winston");

const options = {
  file: {
    level: "info",
    name: "file.info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  errorFile: {
    level: "error",
    name: "file.error",
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

var logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function (message, encoding) {
    // console.log("DateTime: \n", message.split('"')[3].trim().substring(9,29));
    // console.log("API Endpoint: \n", message.split('"')[4].substring(1));
    // console.log("Http Code: \n", message.split('"')[5].trim().substring(0,3));
    // console.log("Device/Browser: \n",message.split('"')[8]);
    // console.log("Log Level: \n", message.split('"')[13]);

    logger.info(message);
  },
};

module.exports = logger;
