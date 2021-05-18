const { model } = require('mongoose');

module.exports = model('User', {
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
