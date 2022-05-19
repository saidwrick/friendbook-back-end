const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    postDate: {
        type: Date, 
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
  }
);

module.exports = mongoose.model('Post', PostSchema);