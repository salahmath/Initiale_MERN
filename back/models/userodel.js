// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  freind:{
    type: String,
    default: false,
  },
  image: {  // New field for storing the image URL
    type: String,
    default: '',
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
