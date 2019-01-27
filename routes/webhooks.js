var express = require('express');
var router = express.Router();
var TwitchSubRequest = require('../models/TwitchSubRequest');

var socketIO = {
  io: null
};

/*
  Subscription Verify Request (from Twitch to Client)

  GET https://yourwebsite.com/path/to/callback/handler? \
  hub.mode=subscribe& \
  hub.topic=https://api.twitch.tv/helix/users/follows?first=1&to_id=1337& \
  hub.lease_seconds=864000& \
  hub.challenge=HzSGH_h04Cgl6VbDJm7IyXSNSlrhaLvBi9eft3bw
*/
function handleSubscriptionVerifyRequest(req, res, next) {

    var hubmode = req.query['hub.mode'];
    var hubtopic = req.query['hub.topic'];
    var hubleaseseconds = req.query['hub.lease_seconds'];
    var hubchallenge = req.query['hub.challenge'];

    var tsr = new TwitchSubRequest({
      mode: hubmode,
      topic: hubtopic,
      lease_seconds: hubleaseseconds,
      challenge: hubchallenge,
      full: JSON.stringify(req.query)
    });
    tsr.save(function(err) {
      if (err) {
        console.log(err);
      } else {}
    });

    if (hubmode == 'subscribe') {
      res.status(200).send(hubchallenge);
    } else if (hubmode == 'unsubscribe') {
      res.status(200).send('OK');
    } else if (hubmode == 'denied') {
      res.status(200).send('OK');
    } else {
      res.status(200).send('OK');
    }
}

router.get('/callback', function(req, res, next) {
  handleSubscriptionVerifyRequest(req, res, next);
});

router.post('/callback', function(req, res, next) {

  var body = req.body;
  console.log('callback body = ' + JSON.stringify(body));
  socketIO.io.emit('topic', JSON.stringify(body));

});

router.get('/callback/follows', function(req, res, next) {
  handleSubscriptionVerifyRequest(req, res, next);
});

router.post('/callback/follows', function(req, res, next) {

  var body = req.body;
  console.log('callback follows body = ' + JSON.stringify(body));
  socketIO.io.emit('topic' + body.data[0].to_id, body.data[0].from_name + ' followed ' + body.data[0].to_name);

});

module.exports = {
  router: router,
  socketIO: socketIO
};
