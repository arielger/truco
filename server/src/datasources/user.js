const R = require("ramda");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");

const User = mongoose.model("User");

class UserAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async logInAsGuest() {
    const newUser = await User.create({
      name: "Anonymous user"
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    return {
      token
    };
  }
}

module.exports = UserAPI;
