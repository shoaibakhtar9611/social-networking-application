const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
// const isValidator = require('../validators/index');

router.get('/', authController.protect, postController.getPosts);

// Liking and Unliking of posts
router.patch('/like', authController.protect, postController.like);
router.patch('/unlike', authController.protect, postController.unlike);

// Commenting on posts
router.patch('/comment', authController.protect, postController.comment);
router.patch('/uncomment', authController.protect, postController.uncomment);

router.post('/:userId', authController.protect, postController.uploadPhoto, postController.createPost);
router.get('/by/:userId', authController.protect, postController.postsByUser);
router.get('/:postId', authController.protect, postController.singlePost);
router.patch('/:postId', authController.protect, postController.isPoster, postController.updatePost);
router.delete('/:postId', authController.protect, postController.isPoster, postController.deletePost);

// router.get('/photo/:postId', postController.photo);

// Any route contaning :userId, our app will execute userById middleware first
router.param('userId', userController.userById);

// Any route contaning :postId, our app will execute postById middleware first
router.param('postId', postController.postById);

module.exports = router;
