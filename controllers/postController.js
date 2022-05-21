const User = require("../models/user");
const Post = require("../models/post");
// const { body,validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");

// //get post info
// exports.postGet = 

// //create new post
// exports.postPost = 

// //update post -- likes/ comments
// exports.postPut = 

// //delete post
// exports.postDelete = 

// //get multiple posts
// exports.postsGet = 

exports.allFriendPostsGet = async function (req, res, next) {
    User.findById(req.userId, "friends")
    .lean()
    .exec(function (err, ids){
        if (err){
            return next(err);
        }
        else {
            const allIds = Object.values(ids.friends).map((value)=>value);
            allIds.push(req.userId);
            console.log(allIds);
            Post.find({"user" : {$in : allIds}}).populate("user", "firstName lastName")
            .exec(function (err, posts){
                if (err){
                    console.log("error")
                    return next(err);
                }
                else {
                    console.log("find")
                    res.status(200).json(posts);
                }
            })
        }
    })
}

exports.newPostPost = function (req, res, next) {
    const post = new Post ( {
        user: req.userId,
        content: req.body.content
    }).save(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json("successfully made a new post");
    });
}


