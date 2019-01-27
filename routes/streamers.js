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
      // console.log(response);
      console.log('getIdByUsernameAndSubTopic response = ' + JSON.stringify(response.data));
      if (response.data && response.data.data && response.data.data.length > 0 && response.data.data[0].id) {

        var promiseFollows = subTopicFollowsById(streamer, response.data.data[0].id);
        var promiseStreams = subTopicStreamsById(streamer, response.data.data[0].id);
        var promiseUsers = subTopicUsersById(streamer, response.data.data[0].id);

        Promise.all([promiseFollows, promiseStreams, promiseUsers])
          .then(function(response) {
            // handle success
            // console.log(response);
          })
          .catch(function(error) {
            // handle error
            // console.log(error);
          })
          .then(function() {
            // always executed
            res.render('streamerhook', {
              user: req.user,
              streamer: streamer,
              streamerId: response.data.data[0].id
            });
          })

      } else {
        res.render('streamerhook', {
          user: req.user,
          streamer: streamer,
          streamerId: ''
        });
      }
    })
    .catch(function(error) {
      // handle error
      // console.log(error);
      res.render('streamerhook', {
        user: req.user,
        streamer: streamer,
        streamerId: ''
      });
    })
    .then(function() {
      // always executed
    });
}

function subTopicFollowsById(streamer, streamerId) {

  var topic = 'https://api.twitch.tv/helix/users/follows?first=1&to_id=' + streamerId;
  console.log('topic = ' + topic);

  var p = axios.post('https://api.twitch.tv/helix/webhooks/hub', {
    'hub.mode': 'subscribe',
    'hub.topic': topic,
    'hub.callback': process.env.TWITCH_WEBHOOK_CALLBACK + '/follows/' + streamerId,
    'hub.lease_seconds': '864000',
    'hub.secret': 's3cRe7'
  }, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    },
  });

  return p;
}

function subTopicStreamsById(streamer, streamerId) {

  var topic = 'https://api.twitch.tv/helix/streams?user_id=' + streamerId;
  console.log('topic = ' + topic);

  var p = axios.post('https://api.twitch.tv/helix/webhooks/hub', {
    'hub.mode': 'subscribe',
    'hub.topic': topic,
    'hub.callback': process.env.TWITCH_WEBHOOK_CALLBACK + '/streams/' + streamerId,
    'hub.lease_seconds': '864000',
    'hub.secret': 's3cRe7'
  }, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    },
  });

  return p;
}

function subTopicUsersById(streamer, streamerId) {

  var topic = 'https://api.twitch.tv/helix/users?id=' + streamerId;
  console.log('topic = ' + topic);

  var p = axios.post('https://api.twitch.tv/helix/webhooks/hub', {
    'hub.mode': 'subscribe',
    'hub.topic': topic,
    'hub.callback': process.env.TWITCH_WEBHOOK_CALLBACK + '/users/' + streamerId,
    'hub.lease_seconds': '864000',
    'hub.secret': 's3cRe7'
  }, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    },
  });

  return p;
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
