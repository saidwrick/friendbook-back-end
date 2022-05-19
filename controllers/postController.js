const User = require("../models/user");
const Post = require("../models/post");
const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect } = require("express/lib/response");
const bcrypt = require("bcryptjs");

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

//get post info
exports.postGet = 

//create new post
exports.postPost = 

//update post -- likes/ comments
exports.postPut = 

//delete post
exports.postDelete = 

//get multiple posts
exports.postsGet = 


