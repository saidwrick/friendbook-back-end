const User = require("../models/user");
// const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect } = require("express/lib/response");
// const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

// //get user info
// // if logged in vs page? 
// exports.userGet = 

// //create new user
// exports.userPost = 

// //update user
// exports.userPut = 

// //delete user
// exports.userDelete = 

// //login user
// exports.userLoginPost = 

exports.userSignUpPost = function (req, res, next){
    const user = new User ({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday
    })
    user.save(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json("successfully created new user");
    });
}

exports.userLoginPost = function (req, res, next){
    console.log("control");
    passport.authenticate("local", {session: false}, function(err, user, info) {
        if (err || !user) {
            return res.status(400).json({
                message: "login failed"
            })
        }
        else{
            console.log(user);
            const token = jwt.sign({userId : user._id}, 'secret', { expiresIn: '1 day'});
            return res.status(200).json({
                message: "success login",
                userId: user._id,
                token,
            })
        }
    })(req, res, next);
}

exports.userProfileGet = function (req, res, next) {
    if (req.headers.type == "general") {
        User.findById(req.params.id, 'firstName lastName profilePictureURL currentLocation friends birthday joinDate')
        .populate({path: "friends", select: ["firstName", "lastName"]})
        .exec(function (err, profile) {
            if (err) {
                return next(err); 
            }
            res.status(200).json(profile);
        });
    }
    else if (req.headers.type == "self") {
        
    }
}
    