const { model } = require('mongoose');

module.exports = model('Message', {
  user: { type: String, required: true },
  chatTarget: { type: String, required: true },
  chatType: { type: String, required: true }, // 'photo'   'private'   'tag'   'location'
  message: { type: String, required: true },
  time: { type: Number, required: true },
});
