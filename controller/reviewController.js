const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(new ApiErrorHandler('Reviews not found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews,
  });
});

exports.getAReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId).populate({
    path: 'user',
    select: '-__v -passwordChangedAt',
  });

  if (!review) {
    return next(new ApiErrorHandler('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    review,
  });
});

exports.createAReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.user._id,
    tour: req.params.tourId,
  });

  res.status(200).json({
    status: 'success',
    review,
  });
});
