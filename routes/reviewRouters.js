/////////////////////////////////////
const express = require('express');
const { protect } = require('../controller/authController');

const {
  getAllReviews,
  getAReview,
  createAReview,
} = require('../controller/reviewController');

//Routing
const router = express.Router({ mergeParams: false });

router.route('/').get(getAllReviews);
router.route('/').post(protect, createAReview);

router.route('/:reviewId').get(getAReview);

module.exports = router;
