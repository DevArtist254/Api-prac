/////////////////////////////////////
const express = require('express');
const { protect } = require('../controller/authController');

const {
  getAllReviews,
  getAReview,
  createAReview,
  deleteReview,
} = require('../controller/reviewController');

//Routing
const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews);
router.route('/').post(protect, createAReview);
router.route('/').delete(protect, deleteReview);

router.route('/:reviewId').get(getAReview);

module.exports = router;
