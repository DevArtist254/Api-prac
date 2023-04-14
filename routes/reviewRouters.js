/////////////////////////////////////
const express = require('express');
const { protect } = require('../controller/authController');

const {
  getAllReviews,
  getAReview,
  createAReview,
} = require('../controller/reviewController');

//Routing
const router = express.Router();

router.route('/').get(getAllReviews);
router.route('/:tourId').post(protect, createAReview);

router.route('/:reviewId').get(getAReview);

module.exports = router;
