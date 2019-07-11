const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");

const { authenticateFacebook, authenticateGoogle } = require("../passport");
const randomCharacters = require("../data/randomCharacters.json");

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const User = mongoose.model("User");

class UserAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async logInAsGuest() {
    const newUser = await User.create(getRandomElement(randomCharacters));

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    return {
      token,
      user: {
        name: newUser.name,
        avatar: newUser.avatar
      }
    };
  }

  async logInWithFacebook({ req, res }) {
    try {
      const { data, info } = await authenticateFacebook(req, res);

      if (data) {
        const user = await User.upsertFacebookUser(data);

        if (user) {
          return {
            user: {
              name: user.name,
              email: user.email,
              avatar: user.avatar
            },
            token: user.generateJWT()
          };
        }
      }

      if (info) {
        switch (info.code) {
          case "ETIMEDOUT":
            return new Error("Failed to reach Facebook: Try Again");
          default:
            return new Error("something went wrong");
        }
      }
      return Error("Error logging in with facebook");
    } catch (error) {
      return error;
    }
  }

  async logInWithGoogle({ req, res }) {
    try {
      const { data, info } = await authenticateGoogle(req, res);

      if (data) {
        const user = await User.upsertGoogleUser(data);

        if (user) {
          return {
            user: {
              name: user.name,
              email: user.email,
              avatar: user.avatar
            },
            token: user.generateJWT()
          };
        }
      }

      if (info) {
        switch (info.code) {
          case "ETIMEDOUT":
            return new Error("Failed to reach Google: Try Again");
          default:
            return new Error("something went wrong");
        }
      }
      return Error("Error logging in with Google");
    } catch (error) {
      return error;
    }
  }

  async getUserInfo({ userId }) {
    const user = await User.findById(userId);
    return user.toObject();
  }
}

module.exports = UserAPI;
