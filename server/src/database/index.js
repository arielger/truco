const mongoose = require("mongoose");

require("./models/match");
require("./models/user");

mongoose.connect(process.env.MONGODB_CONNECTION_URI);

const db = mongoose.connection;

db.on("error", err => {
  console.error("connection error", err);
});
db.once("open", function() {
  console.log("we are connected");
});
