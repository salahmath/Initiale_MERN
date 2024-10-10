const mongoose = require('mongoose');

const GoogleSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  freind:{
    type: String,
    default: false,
  }
});

const User_google = mongoose.model('User_google', GoogleSchema);

module.exports = User_google;
