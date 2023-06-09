const {Schema, model} = require('mongoose');

const User = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true
  },
  email: {
    type: String, 
    unique: true, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  avatar: {
    type: String, 
    default: ""
  },
  posts: {
    type: Array, 
    default: []
  }
})

module.exports = model('User', User)