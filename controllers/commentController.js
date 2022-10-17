const User = require("../models/user");
const Post = require("../models/post")
const Comment = require("../models/comment")
const { body, validationResult } = require("express-validator");

exports.commentsGet = function (req, res, next){
    Post.findById(req.params.id, "comments")
    .populate({path: "comments", populate: {path: "user", select: "firstName lastName profilePicUrl"}})
    .exec(function (err, comments){
        if (err) {
            return next(err);
        }
        else{
            res.status(200).json(comments);
        }
    })
}


exports.commentPost = [
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
            const comment = new Comment ({
                post: req.params.id,
                user: req.userId,
                content: req.body.content
            }).save((err, comment) =>{
                if (err){
                    return next(err);
                }
                else {
                    Post.findByIdAndUpdate(req.params.id, 
                    {$addToSet: {"comments" : comment._id }}, 
                    function (err){
                        if (err){
                            return next(err);
                        }
                        else {
                            return res.status(200).json("new comment posted")
                        }
                    })
                }
            })
        }
    }
]

exports.commentDelete = function (req, res, next) {
    Comment.findByIdAndDelete(req.params.id)
    .exec (function (err, likes) {
        if (err){
            return next (err);
        }
        else {
            return res.status(200).json("successfully deleted comment");
        }
    })
}

exports.commentLikePut = function (req, res, next) {
    Comment.findById(req.params.id, async function(err, comment){
        if (err){
            return next(err);
        }
        else {
            index = comment.likes.indexOf(req.userId);
            if (index >= 0){
                comment.likes.splice(index, 1);
                comment.save(err =>{
                    if (err) {
                        return next(err);
                    }
                    else{
                        return res.status(200).json("user unliked the comment")
                    }
                });
            }
            else{
                comment.likes.push(req.userId)
                comment.save(err => {
                    if (err) {
                        return next (err);
                    }
                    else{
                        return res.status(200).json("user liked the comment")
                    }
                });
            }
        }
    })
}

exports.commentLikesGet = function (req, res, next) {
    Comment.findById(req.params.id, "likes")
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

