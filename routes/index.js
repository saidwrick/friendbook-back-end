const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require ('../controllers/commentController');

// /signup sign up
// /login login
router.post('/signup', userController.userSignUpPost);
router.post('/login', userController.userLoginPost);

// users get all users
router.get('/users', userController.userProfilesGet);

// users/id (for other) get info/ nested/posts/comments
// users/id (for logged in) login(don't get posts) vs load self page(get posts)
// users/id update(for logged in)
router.get('/users/:id', userController.userProfileGet);
router.put('/users/:id', userController.userProfilePut);

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
router.delete('/posts/:id', postController.postDelete)

// posts/id add/remove like *likes
router.put('/posts/:id', postController.postLikePut)

//get post comments
router.get('/posts/:id/comments', commentController.commentsGet)

// add comment to post
router.post('/posts/:id/comments', commentController.commentPost)

router.get('/posts/:id/likes', postController.postLikesGet)

// comments/id add/remove like
router.put('/comments/:id', commentController.commentLikePut)
router.get('/comments/:id/likes', commentController.commentLikesGet)
router.delete('/comments/:id', commentController.commentDelete)
// comments/id delete 






module.exports = router;
