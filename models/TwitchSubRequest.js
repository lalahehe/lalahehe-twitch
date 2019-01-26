var mongoose = require('mongoose');

var TwitchSubRequestSchema = new mongoose.Schema({
  mode: String,
  topic: String,
  lease_seconds: String,
  challenge: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TwitchSubRequest', TwitchSubRequestSchema);
