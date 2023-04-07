/////////////////////////////////////
const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controller/authController');

//Routing
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').post(resetPassword);

module.exports = router;
