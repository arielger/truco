const fs = require("fs");
const path = require("path");

const root = fs.readFileSync(path.join(__dirname, "root.graphql"), "utf8");
const matches = fs.readFileSync(
  path.join(__dirname, "matches.graphql"),
  "utf8"
);
const user = fs.readFileSync(path.join(__dirname, "user.graphql"), "utf8");

const schemaArray = [root, user, matches];

module.exports = schemaArray;
