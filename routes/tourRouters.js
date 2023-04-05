/////////////////////////////////////
const express = require('express');
const {
  cheapTours,
  getAllTours,
  createATour,
  getATour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controller/tourController');

const { protect, restrictTo } = require('../controller/authController');
//Routing
const router = express.Router();

router.route('/top-five-cheap').get(cheapTours, getAllTours);

router.route('/getMonthlyPlan').get(getMonthlyPlan);

router.route('/tourStats').get(getTourStats);

router.route('/').get(protect, getAllTours).post(createATour);

//router.param('id', checkId);

router
  .route('/:id')
  .get(getATour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
