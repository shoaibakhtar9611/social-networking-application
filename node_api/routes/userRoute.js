const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.patch('/follow', authController.protect, userController.addFollowing, userController.addFollower);
router.patch('/unfollow', authController.protect, userController.removeFollowing, userController.removeFollower);

router.get('/', userController.getAllUsers);
router.get('/:userId', authController.protect, userController.getUser);
router.patch('/:userId', authController.protect, userController.uploadPhoto, userController.updateUser);
router.delete('/:userId', authController.protect, userController.deleteUser);

router.get('/photo/:userId', userController.userPhoto);

// Whom to follow
router.get('/findpeople/:userId', authController.protect, userController.findPeople);

// Any route contaning :userId, our app will execute userById middleware first
router.param('userId', userController.userById);

module.exports = router;
 