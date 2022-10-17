const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");

exports.userPostsGet = async function (req, res, next) {
    if (req.headers.type == "self"){
        User.findById(req.userId, "friends")
        .lean()
        .exec(function (err, ids){
            if (err){
                return next(err);
            }
            if (!ids){
                res.status(501).json("users not found")
            }
            else {
                const allIds = Object.values(ids.friends).map((value)=>value);
                allIds.push(req.userId);
                Post.find({"user" : {$in : allIds}})
                .sort({postDate : -1})
                .populate("user", "firstName lastName profilePicUrl")
                .exec(function (err, posts){
                    if (err){
                        return next(err);
                    }
                    if (!posts){
                        res.status(501).json("posts not found")
                    }
                    else {
                        res.status(200).json(posts);
                    }
                })
            }
        })
    }
    else if (req.headers.type == "general"){
        Post.find({"user" : req.params.id})
        .sort({postDate : -1})
        .populate("user", "firstName lastName profilePicUrl")
        .exec(function (err, posts){
            if (err){
                console.log("error")
                return next(err);
            }
            if(!posts){
                res.status(501).json("posts not found")
            }
            else {
                console.log("find")
                res.status(200).json(posts);
            }
        })
    }
}

exports.newPostPost = [
    body('content', 'content required').trim().isLength({ min: 1 }),
    (req, res, next) => {
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            const errorArray = errors.array();
            let errorString = ""

            if (errorArray.length == 1){
                errorString = errorArray[0].msg
            }
            else {
                errorString = errors.array().reduce((prev, cur) => {
                    return (prev.msg || prev) + '\r\n' + cur.msg
                })
            }
            return res.status(400).json(errorString)
        }

        else {

            const post = new Post ({
                user: req.userId,
                content: req.body.content
            }).save(err => {
                if (err) {
                    return next(err);
                }
                else{
                res.status(200).json("successfully made a new post");
                }
            });
        }
    }
]

exports.postDelete = function (req, res, next) {
    Post.findByIdAndDelete(req.params.id)
    .exec (function (err, likes) {
        if (err){
            return next (err);
        }
        else {
            return res.status(200).json("successfully deleted post");
        }
    })
}

exports.postLikePut = function (req, res, next) {
    Post.findById(req.params.id, async function(err, post){
        if (err){
            return next(err);
        }
        if (!post){
            res.status(501).json("Post not found")
        }
        else {
            index = post.likes.indexOf(req.userId);
            if (index >= 0){
                post.likes.splice(index, 1);
                post.save(err =>{
                    if (err) {
                        return next(err);
                    }
                    else{
                        return res.status(200).json("user unliked the post")
                    }
                });
            }
            else{
                post.likes.push(req.userId)
                post.save(err => {
                    if (err) {
                        return next (err);
                    }
                    else{
                        return res.status(200).json("user liked the post")
                    }
                });
            }
        }
    })
}

exports.postLikesGet = function (req, res, next) {
    Post.findById(req.params.id, "likes")
    .populate({path: "likes", select: "firstName lastName profilePicUrl"})
    .exec (function (err, likes) {
        if (err){
            return next (err);
        }
        else {
            return res.status(200).json(likes);
        }
    })
}