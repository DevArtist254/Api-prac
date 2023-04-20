/////////////////////////////////////
const express = require('express');
const { protect, restrictTo } = require('../controller/authController');

const {
  getAllReviews,
  getAReview,
  createAReview,
  deleteReview,
  updateAReview,
} = require('../controller/reviewController');

//Routing
const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews);
router.route('/').post(protect, restrictTo('user'), createAReview);
router.route('/').delete(protect, restrictTo('user'), deleteReview);
router.route('/').patch(protect, restrictTo('user'), updateAReview);

router.route('/:reviewId').get(getAReview);

module.exports = router;
