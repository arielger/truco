const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");

const User = mongoose.model("User");

class UserAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async logInAsGuest({ name, avatar }) {
    const newUser = await User.create({
      name,
      avatar
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    return {
      token
    };
  }

  async getUserInfo({ userId }) {
    const user = await User.findById(userId);
    return user.toObject();
  }
}

module.exports = UserAPI;
