const app = require("./server");
const http = require("http").createServer(app);
require("dotenv").config();
var db = require("./models");

const port = process.env.PORT || 3000;

db.sequelize
  .sync()
  .then(function () {
    http.listen(port);
  })
  .catch(function (err) {
    console.log(err, "Oh no !! Something went wrong with the Database!");
  });
