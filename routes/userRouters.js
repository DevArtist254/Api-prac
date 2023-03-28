/////////////////////////////////////
const express = require('express');
const { signup } = require('../controller/authController');

//Routing
const router = express.Router();

router.route('/signup').post(signup);

module.exports = router;