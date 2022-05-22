const User = require("../models/user");
const Post = require("../models/post")
const Comment = require("../models/comment")

// //get comment info
// exports.commentGet = 

// //create new comment
// exports.commentPost = 

// //update comment likes
// exports.commentPut = 

// //delete comment
// exports.commentDelete = 

exports.commentsGet = function (req, res, next){
    Post.findById(req.params.id, "comments")
    .populate({path: "comments", populate: {path: "user", select: "firstName lastName profilePictureURL"}})
    .exec(function (err, comments){
        if (err) {
            return next(err);
        }
        else{
            res.status(200).json(comments);
        }
    })
}


exports.commentPost = function (req, res, next) {
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



