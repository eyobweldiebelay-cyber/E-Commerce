const express = require('express');

const router = express.Router();
const authmiddleware=require('../middleware/authMiddleware')

const authController = require('../controllers/authController');

router.post('/register', authController.register);
//login route
router.post('/login', authController.login);
//getProfile
router.get('/profile', authmiddleware, authController.getProfile);
module.exports = router;