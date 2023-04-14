const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'The review must have a review'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The review must have a User'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'The review must have a Tour'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// review/ rating/ CreatedAt/ ref to tour/ ref to user
/**
 * {
    "_id": "5c8a34ed14eb5c17645c9108",
    "review": "Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eros condimentum scelerisque taciti mattis praesent feugiat eu nascetur a tincidunt",
    "rating": 5,
    "user": "5c8a1dfa2f8fb814b56fa181",
    "tour": "5c88fa8cf4afda39709c2955"
  }
 */
