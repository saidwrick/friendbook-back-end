const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
        type: String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address'],
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    birthday: {
        type: Date,
        required: true
    },
    joinDate: {
        type: Date, 
        default: Date.now
    },
    profilePictureURL: {
        type: String,
        default: "default/url"
    },
    currentLocation: {
        type: String
    },
    friends: [{ type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    sentRequestFriends: [{ type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    recievedRequestFriends: [{ type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }]
  }
);

UserSchema
.virtual('birthdayFormatted')
.get(function () {
    return this.birthday.toLocaleDateString("en-US")
});

UserSchema
.virtual('joinDateFormatted')
.get(function () {
    return this.joinDate.toLocaleDateString("en-US")
});

module.exports = mongoose.model('User', UserSchema);