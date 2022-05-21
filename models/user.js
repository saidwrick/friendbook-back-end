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

UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

UserSchema.virtual('birthdayFormatted').get(function () {
    const birthday = new Date(this.birthday).toLocaleDateString("en-us", {year: "numeric", month: "long", day: "numeric"});
    return birthday
});

UserSchema
.virtual('joinDateFormatted')
.get(function () {
    const joinDate = new Date (this.joinDate).toLocaleDateString("en-us", {year: "numeric", month: "long", day: "numeric"});
    return joinDate
});

module.exports = mongoose.model('User', UserSchema);