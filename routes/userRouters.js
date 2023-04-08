/////////////////////////////////////
const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controller/authController');

const { updateMe } = require('../controller/userController');

//Routing
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').post(resetPassword);
router.route('/updatePassword').post(protect, updatePassword);

router.route('/updateMe').patch(protect, updateMe);

module.exports = router;
