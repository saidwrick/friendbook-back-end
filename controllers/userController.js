const User = require("../models/user");
const { body,validationResult } = require("express-validator");
const passport = require("passport");
const { redirect, send } = require("express/lib/response");
// const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.userCreateGet = function (req, res, next){
    res.render('signUp');
};

exports.userSignUpPost = [
    body('email', 'email required').trim().isLength({ min: 5 }).escape().isEmail().withMessage("email not valid"),
    body('password', 'password required').trim().isLength({ min: 1 }).escape(),
    body('firstName', 'first name required').trim().isLength({ min: 1 }).escape(),
    body('lastName', 'last name required').trim().isLength({ min: 1 }).escape(),
    body('birthday', 'birthday required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            const errorString = errors.array().reduce((prev, cur) => {
                return (prev.msg || prev) + '\r\n' + cur.msg
            })
            return res.status(400).json(errorString)
        }

        else {
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
                    if (err.code == 11000){
                        return res.status(400).json("email already in use");
                    }
                    else{
                        return next(err);
                    }
                }
                res.status(200).json("successfully created new user");
            });
        }
    }
]

exports.userLoginPost = function (req, res, next){
    passport.authenticate("local", {session: false}, function(err, user, info) {
        if (err || !user) {
            return res.status(401).json({
                message: "incorrect password or email"
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
                return res.status(404).json("User not found")
            }
            if (!profile){
                res.status(404).json("User not found")
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
                return res.status(404).json("User not found")
            }
            if (!profile){
                res.status(404).json("User not found")
            }
            else {
                res.status(200).json(profile);
            }
        });
    }
}

exports.userProfilesGet = function (req, res, next) {
    let search = null;

    if (req.query.search){
        search = [{"firstName" : {"$regex" : req.query.search, "$options" : "i" }}, 
            {"lastName" : {"$regex" : req.query.search, "$options" : "i" }}]
    }

    if (req.headers.type == "all") {

        let query = {
            _id : {$ne: req.userId}
        };

        if (search){
            query["$or"] = search
        }

        User.find(query, "firstName lastName profilePicUrl",)
        .collation( {locale: "en", strength: 1})
        .sort({"firstName" : 1})
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(404).json("Users not found")
            }
            else {
                res.status(200).json(profiles)
            }
        });
    }

    else if (req.headers.type == "friends") {
        let populate = {
            path: "friends", 
            select: "firstName lastName profilePicUrl", 
            options: {
                collation: {
                    locale : "en", 
                    strength : 1
                }, 
                sort : { 
                    "firstName" : 1
                }
            }
        }

        if (search){
            populate["match"] = {
                $or: search
            }
        }

        User.findById(req.userId, "friends")
        .populate(populate)
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(404).json("Users not found")
            }
            else {
                res.status(200).json(profiles)
            }
        });
    }
    else if (req.headers.type == "friend-requests") {

        let populate = {
            path: "recievedRequestFriends", 
            select: "firstName lastName profilePicUrl", 
            options: {
                collation: {
                    locale : "en", 
                    strength : 1
                }, 
                sort : { 
                    "firstName" : 1
                }
            }
        }

        if (search){
            populate["match"] = {
                $or: search
            }
        }
        User.findById(req.userId, "recievedRequestFriends")
        .populate(populate)
        .exec (function (err, profiles) {
            if (err) {
                return next(err);
            }
            if (!profiles){
                res.status(404).json("Users not found")
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

exports.userProfilePut = [
    body('firstName', 'first name required').trim().isLength({ min: 1 }).withMessage("first name can't be empty").escape(),
    body('lastName', 'last name required').trim().isLength({ min: 1 }).withMessage("last name can't be empty").escape(),
    body('birthday', 'birthday required').trim().isLength({ min: 1 }).withMessage("birthday can't be empty").escape(),

    (req, res, next) => {
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            const errorString = errors.array().reduce((prev, cur) => {
                return (prev.msg || prev) + '\r\n' + cur.msg
            })
            return res.status(400).json(errorString)
        }

        else {
            if (req.userId != req.params.id){
                return res.status(401).json("Unauthorized access")
            }

            let query = {
                "firstName" : req.body.firstName,
                "lastName" : req.body.lastName,
                "birthday" : req.body.birthday
            }

            if (req.body.profilePicUrl){
                query["profilePicUrl"] = req.body.profilePicUrl
            }

            User.findByIdAndUpdate(req.userId, query, function (err, result) {
                if (err || !result) {
                    return next(err);
                }
                else {
                    return res.status(200).json("successfully updated profile");
                }
            });
        }
    }
]
        

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
                res.status(404).json("User not found")
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
                            res.status(404).json("User not found")
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
                res.status(404).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId},
                {$pull: {"recievedRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(404).json("User not found")
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
                res.status(404).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId}, 
                {$addToSet: {"sentRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(404).json("User not found")
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
                res.status(404).json("User not found")
            }
            else {
                User.findOneAndUpdate({_id : req.userId}, 
                {$pull: {"sentRequestFriends" : req.params.id}}, 
                function (err, result){
                    if (err) {
                        return next(err);
                    }
                    if (!result){
                        res.status(404).json("User not found")
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
                    res.status(404).json("User not found")
                }
                else {
                    User.findOneAndUpdate({_id : req.userId}, 
                    {$pull: {"friends" : req.params.id}}, 
                    function (err, result){
                        if (err) {
                            return next(err);
                        }
                        if (!result){
                            res.status(404).json("User not found")
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
    