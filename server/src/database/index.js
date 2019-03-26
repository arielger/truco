const mongoose = require("mongoose");

require("./models/match");
require("./models/user");

const isProduction = process.env.NODE_ENV === "production";

mongoose.connect(
  isProduction
    ? process.env.MONGODB_CONNECTION_URI
    : "mongodb://127.0.0.1/truco"
);

const db = mongoose.connection;

db.on("error", err => {
  console.error("connection error", err);
});
db.once("open", function() {
  console.log("we are connected");
});
