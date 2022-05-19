const User = require("../models/user");
const Post = require("../models/post")
const Comment = require("../models/comment")
const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect } = require("express/lib/response");
const bcrypt = require("bcryptjs");

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

//get comment info
exports.commentGet = 

//create new comment
exports.commentPost = 

//update comment likes
exports.commentPut = 

//delete comment
exports.commentDelete = 



