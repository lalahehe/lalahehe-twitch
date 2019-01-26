var express = require('express');
var router = express.Router();
var passportTwitch = require('../auth/twitch');
var passport = require('passport');
var User = require('../models/User');

passport.serializeUser(function(user, fn) {
  fn(null, user);
});

passport.deserializeUser(function(id, fn) {
  User.findOne({
    _id: id.doc._id
  }, function(err, user) {
    fn(err, user);
  });
});

/* LOGOUT ROUTER */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* TWITCH ROUTER */
router.get('/twitch',
  passportTwitch.authenticate('twitch'));

router.get('/twitch/callback',
  passportTwitch.authenticate('twitch', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


module.exports = router;
