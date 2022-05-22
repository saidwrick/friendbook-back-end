const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require ('../controllers/commentController');
/* 
get logged in user info (details/ friends)
get posts of friends + user for logged in user
user update profile

user create post
user delete post
user create comment
user delete comment
user like/unlike posts
user like/unlike comments

user add friend
user delete friend
user un-send friend request
reject friend request

user get notifications
user update read notifications

sign up
login

get all users
get other user profile info
get other user posts for profile info
*/

// * needs notification

// /signup sign up
// /login login
router.post('/signup', userController.userSignUpPost);
router.post('/login', userController.userLoginPost);

// users get all users
router.get('/users', userController.userAllProfilesGet);

// users/id (for other) get info/ nested/posts/comments
// users/id (for logged in) login(don't get posts) vs load self page(get posts)
// users/id update(for logged in)
router.get('/users/:id', userController.userProfileGet);
router.put('/users/:id')

// users/id/friends friend actions put in req.body *accepts/ requested
router.put('/users/:id/friend-actions', userController.userFriendActionsPut);

// users/id/notifications get/update notifications
router.get('/users/:id/notifications')
router.put('/users/:id/notifications')

// posts/ get all posts (filter by ID)
router.get('/users/:id/posts', postController.userPostsGet)

//create new post
router.post('/users/:id/posts', postController.newPostPost);

// posts/id get specific post (for notification)
// posts/id delete post
router.get('/posts/:id')
router.delete('/posts/:id')

// posts/id add/remove like *likes
router.put('/posts/:id', postController.postLikePut)

//get post comments
router.get('/posts/:id/comments', commentController.commentsGet)

// add comment to post
router.post('/posts/:id/comments', commentController.commentPost)

// comments/id add/remove like
router.put('/comments/:id', commentController.commentLikePut)

// comments/id delete 
router.delete('/comments/:id')






module.exports = router;
