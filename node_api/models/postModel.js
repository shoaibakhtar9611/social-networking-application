const mongoose = require('mongoose');
 
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [4, 'Title must have at least 4 characters'],
    maxlength: [150, 'Title must not exceed 150 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    minlength: [4, 'Body must have at least 4 characters'],
    maxlength: [2000, 'Body must not exceed 2000 characters']
  },
  photo: {
    type: String
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  comments: [{
    text: String,
    created: {
      type: Date, 
      default: Date.now
    },
    postedBy: {
      type:mongoose.Schema.ObjectId,
      ref: "User"
    }
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
