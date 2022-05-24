const User = require("../models/user");
// const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect, send } = require("express/lib/response");
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
        birthday: req.body.birthday,
        profilePicUrl: req.body.profilePicUrl
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
        User.findById(req.params.id, 'firstName lastName profilePicUrl currentLocation friends birthday joinDate')
        .populate({path: "friends", select: ["firstName", "lastName", "profilePicUrl"]})
        .exec(function (err, profile) {
            if (err) {
                return next(err); 
            }
            if (!profile){
                res.status(504).json("User not found")
            }
            else {
                res.status(200).json(profile);
            }
        });
    }
    else if (req.headers.type == "self") {
        User.findById(req.userId, 'firstName lastName profilePicUrl currentLocation friends birthday joinDate sentRequestFriends recievedRequestFriends')
        .exec(function (err, profile) {
            if (err) {
                return next(err); 
            }
            if (!profile){
                res.status(501).json("User not found")
            }
            else {
                res.status(200).json(profile);
            }
        });
    }
}

exports.userProfilesGet = function (req, res, next) {
    if (req.headers.type == "all") {
        User.find({_id : {$ne: req.userId}}, "firstName lastName profilePicUrl")
        .collation( {locale: "en", strength: 1})
        .sort({"firstName" : 1})
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(504).json("Users not found")
            }
            else {
                res.status(200).json(profiles)
            }
        });
    }
    else if (req.headers.type == "friends") {
        User.findById(req.userId, "friends")
        .collation({locale: "en", strength: 1})
        .populate({path: "friends", select: "firstName lastName profilePicUrl", 
            options: {collation: {locale: "en", strength : 1}, sort : { "firstName" : 1}}})
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(504).json("Users not found")
            }
            else {
                res.status(200).json(profiles)
            }
        });
    }
    else if (req.headers.type == "friend-requests") {
        User.findById(req.userId, "recievedRequestFriends")
        .populate({path: "recievedRequestFriends", select: "firstName lastName profilePicUrl", 
            options: {collation: {locale: "en", strength : 1}, sort : { "firstName" : 1}}})
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(504).json("Users not found")
            }
            else {
                res.status(200).json(profiles)
            }
        });
    }
    else {
        res.status(400).json("no action type provided")
    }
}

exports.userFriendActionsPut = function (req, res, next) {
    if (req.body.type == "accept"){
        User.findOneAndUpdate({_id : req.params.id},
        {$addToSet: {"friends" : req.userId},
            $pull: {"sentRequestFriends" : req.userId}}, 
        function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result){
                res.status(504).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId}, 
                    {$addToSet: {"friends" : req.params.id},
                        $pull: {"recievedRequestFriends" : req.params.id}}, 
                    function (err, result){
                        if (err) {
                            return next(err);
                        }
                        if (!result){
                            res.status(504).json("User not found")
                        }
                        else {
                            return res.status(200).json("success");
                        }
                    }
                );
            }
        });
    }
    else if (req.body.type == "deny"){
        User.findOneAndUpdate({_id : req.params.id},
        {$pull: {"sentRequestFriends" : req.userId}}, 
        function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result){
                res.status(504).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId},
                {$pull: {"recievedRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(504).json("User not found")
                    }
                    else {
                        return res.status(200).json("success");
                    }
                });
            }
        });
    }
    else if (req.body.type == "request"){
        console.log("here");
        User.findOneAndUpdate({_id : req.params.id}, 
        {$addToSet: {"recievedRequestFriends" : req.userId}}, 
        function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result){
                res.status(504).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId}, 
                {$addToSet: {"sentRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(504).json("User not found")
                    }
                    else {
                        return res.status(200).json("success");
                    }
                });
            }
        });
    }
    else if (req.body.type == "cancel"){
        User.findOneAndUpdate({_id : req.params.id}, 
        {$pull: {"recievedRequestFriends" : req.userId}}, 
        function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result){
                res.status(504).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId}, 
                {$pull: {"sentRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(504).json("User not found")
                    }
                    else {
                        return res.status(200).json("success");
                    }
                });
            }
        });
    }
    else if (req.body.type == "delete"){
        User.findOneAndUpdate({_id : req.params.id}, 
            {$pull: {"friends" : req.userId}}, 
            function (err, result) {
                if (err) {
                    return next(err);
                }
                if (!result){
                    res.status(504).json("User not found")
                }
                else {
                    User.findOneAndUpdate({_id : req.userId}, 
                    {$pull: {"friends" : req.params.id}}, 
                    function (err, result){
                        if (err) {
                            return next(err);
                        }
                        if (!result){
                            res.status(504).json("User not found")
                        }
                        else {
                            return res.status(200).json(result);
                        }
                    });
                }
            }
        );
    }
    else {
        res.status(400).json("no action type provided")
    }
}
    