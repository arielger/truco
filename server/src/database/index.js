const mongoose = require("mongoose");

require("./models/match");
require("./models/user");

mongoose.connect("mongodb://127.0.0.1/truco");

const db = mongoose.connection;

db.on("error", err => {
  console.error("connection error", err);
});
db.once("open", function() {
  console.log("we are connected");
});
