const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    relevantUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    relevantComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    relevantPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    notificationDate: {
        type: Date, 
        default: Date.now
    },
    type: {
        type: String,
        enum: ['FriendRequest', 'FriendAccept', 'NewComment', 'LikedPost', 'LikedComment'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);