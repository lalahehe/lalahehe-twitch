var express = require('express');
var router = express.Router();
var axios = require('axios');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

function getIdByUsernameAndSubTopic(req, res, streamer) {

  axios.get('https://api.twitch.tv/helix/users', {
      params: {
        'login': streamer
      },
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID
      }
    })
    .then(function(response) {
      // handle success
      console.log(response);
      if (response.data && response.data.data && response.data.data.id) {
        subTopicById(req, res, response.data.id);
        
      } else {
        res.render('streamerhook', {
          user: req.user,
          streamer: streamer
        });
      }
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      res.render('streamerhook', {
        user: req.user,
        streamer: streamer
      });
    })
    .then(function() {
      // always executed
    });
}

function subTopicById(req, res, streamerId) {

  axios.post('https://api.twitch.tv/helix/webhooks/hub', {
      'hub.mode': 'subscribe',
      'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=' + streamerId,
      'hub.callback': process.env.TWITCH_WEBHOOK_CALLBACK,
      'hub.lease_seconds': '864000',
      'hub.secret': 's3cRe7'
    }, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Content-Type': 'application/json'
      },
    })
    .then(function(response) {
      // handle success
      console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
      res.render('streamerhook', {
        user: req.user,
        streamer: streamer
      });
    });
}

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', ensureAuthenticated, function(req, res, next) {

  var streamer = req.body.streamer;
  if (streamer) {
    streamer = streamer.trim();
  }
  if (streamer != '') {
    getIdByUsernameAndSubTopic(req, res, streamer);
  } else {
    res.redirect('/');
  }

});

module.exports = router;
