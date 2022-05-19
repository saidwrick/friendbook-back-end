var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
router.post('/signup')
router.post('/login')

// users get all users
// users/id (for other)
// users/id (for logged in)
// users/id update(for logged in)
router.get('/users')
router.get('/users/:id')

// users/id/friends friend actions put in req.body *accepts/ requested
router.get('/users/:id/friend-actions')

// users/id/notifications get/update notifications
router.get('/users/:id/notifications')
router.put('/users/:id/notifications')

// users/id/posts get posts for 1 user
router.get('/users/:id/posts')

// posts/ get all posts (filter by ID)
router.get('/posts')

// posts/id get specific post (for notification)
// posts/id delete post
router.get('/posts/:id')
router.delete('/posts:id')

// posts/id add/remove like *likes
router.put('/posts/:id')


// comments/id add/remove like
router.put('/comments/:id')

// comments/id delete 
router.delete('/comments/:id')




module.exports = router;
