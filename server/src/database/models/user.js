const R = require("ramda");
const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")();
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  social: {
    facebookProvider: {
      id: String,
      token: String
    },
    googleProvider: {
      id: String,
      token: String
    }
  }
});

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    process.env.JWT_SECRET
  );
};

userSchema.statics.upsertGoogleUser = async function({
  accessToken,
  refreshToken,
  profile
}) {
  const User = this;

  const user = await User.findOne({
    "social.googleProvider.id": profile.id
  });

  if (!user) {
    const newUser = await User.create({
      name: profile.displayName || `${profile.givenName} ${profile.familyName}`,
      email: profile.emails[0].value,
      "social.googleProvider": {
        id: profile.id,
        token: accessToken
      },
      avatar: R.path(["_json", "picture"], profile)
    });

    return newUser;
  }

  return user;
};

userSchema.statics.upsertFacebookUser = async function({
  accessToken,
  refreshToken,
  profile
}) {
  const User = this;

  const user = await User.findOne({
    "social.facebookProvider.id": profile.id
  });

  if (!user) {
    const newUser = await User.create({
      name: profile.displayName || `${profile.givenName} ${profile.familyName}`,
      email: profile.emails[0].value,
      "social.facebookProvider": {
        id: profile.id,
        token: accessToken
      },
      avatar: R.path(["photos", 0, "value"], profile)
    });

    return newUser;
  }

  return user;
};

userSchema.set("toObject", {
  virtuals: true
});

userSchema.plugin(mongooseHidden);

const User = mongoose.model("User", userSchema);

module.exports = User;
