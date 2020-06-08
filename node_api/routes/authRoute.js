const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Any route contaning :userId, our app will execute userById middleware first
router.param('userId', userController.userById);

module.exports = router;
