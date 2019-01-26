var passport = require("passport");
var TwitchStrategy = require("passport-twitch").Strategy;
var User = require('../models/User');

passport.use(new TwitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.TWITCH_AUTH_CALLBACK,
    scope: "user_read channel_subscriptions channel:moderate chat:edit chat:read whispers:read whispers:edit"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      userid: profile.id
    }, {
      userid: profile.id,
      name: profile.displayName,
      network: "twitch",
      accessToken: accessToken,
      refreshToken: refreshToken
    }, function(err, user) {
      if (err) {
        done(err);
      }
      done(null, user);
    });
  }
));

module.exports = passport;
