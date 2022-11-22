const mongoose = require('mongoose')
const { Comments } = require('../controllers/posts')
const User = require('../models/user')

const PostSchema = new mongoose.Schema({
  message: String,
  commentInfo: {
    commenter: String,
    commentContent: String
  },
  // commenters: {type: Array, default: []},
  likes: { type: Number, default: 0 },
  // connects to id from User schema
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
},
{ timestamps: true }

);

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
