const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect } = require("express/lib/response");
const bcrypt = require("bcryptjs");

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

//get notification info
exports.notificationGet = 

//create new notification
exports.notificationPost = 

//update notification read/unread
exports.notificationPut = 

//delete notification
exports.notificationDelete = 



