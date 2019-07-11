const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { Strategy: GoogleTokenStrategy } = require("passport-google-token");

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    },
    (accessToken, refreshToken, profile, done) =>
      done(null, {
        accessToken,
        refreshToken,
        profile
      })
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, done) =>
      done(null, {
        accessToken,
        refreshToken,
        profile
      })
  )
);

const authenticateFacebook = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "facebook-token",
      { session: false },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });

const authenticateGoogle = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "google-token",
      { session: false },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });

module.exports = {
  authenticateFacebook,
  authenticateGoogle
};
