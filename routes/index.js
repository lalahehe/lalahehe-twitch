var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('user', {
      user: req.user
    });
  } else {
    res.render('login', {});
  }
});

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.render('test', {});
});




module.exports = router;
