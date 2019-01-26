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
router.get('/callback', function(req, res, next) {

  var hubmode = req.params['hub.mode'];
  var hubtopic = req.params['hub.topic'];
  var hubleaseseconds = req.params['hub.lease_seconds'];
  var hubchallenge = req.params['hub.challenge'];


  var tsr = new TwitchSubRequest({
    mode: hubmode,
    topic: hubtopic,
    lease_seconds: hubleaseseconds,
    challenge: hubchallenge
  });
  tsr.save(function(err) {
    if (err) {
      console.log(err);
    } else {}
  });

  // socketIO.io.emit('time', new Date().toTimeString());
  if (hubmode == 'subscribe') {
    res.status(200).send(hubchallenge);
  } else if (hubmode == 'denied') {
    res.status(200).send('OK');
  } else {
    res.status(200).send('OK');
  }
});

router.post('/callback', function(req, res, next) {

  var body = req.body;
  socketIO.io.emit('time', JSON.stringify(body));

});

module.exports = {
  router: router,
  socketIO: socketIO
};
