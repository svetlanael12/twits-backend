const { Schema, model } = require('mongoose')

const Post = new Schema({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  date: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
})

module.exports = model('Post', Post)