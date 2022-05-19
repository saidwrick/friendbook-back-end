const User = require("../models/user");
const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect } = require("express/lib/response");
const bcrypt = require("bcryptjs");

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

//get user info
// if logged in vs page? 
exports.userGet = 

//create new user
exports.userPost = 

//update user
exports.userPut = 

//delete user
exports.userDelete = 

//login user
exports.userLoginPost = 

