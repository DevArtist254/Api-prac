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
//Routing
const router = express.Router();

router.route('/top-five-cheap').get(cheapTours, getAllTours);

router.route('/getMonthlyPlan').get(getMonthlyPlan);

router.route('/tourStats').get(getTourStats);

router.route('/').get(getAllTours).post(createATour);

//router.param('id', checkId);

router.route('/:id').get(getATour).patch(updateTour).delete(deleteTour);

module.exports = router;
