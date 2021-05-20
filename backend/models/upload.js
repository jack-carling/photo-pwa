const { model } = require('mongoose');

module.exports = model('Upload', {
  user: { type: String, required: true },
  url: { type: String, required: true },
  location: { type: String, required: false },
  tags: { type: Array, required: false },
  time: { type: Number, required: true },
});
