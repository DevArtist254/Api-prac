// const fs = require("fs")
// const urlToDB = `${__dirname}/../dev-data/data/tours-simple.json`;

///////////////////////////////////
//Setting up our data
// const database = fs.readFileSync(urlToDB, 'utf8', (err) => {
//  console.log(err)
// })

// const data = JSON.parse(database)

// ///////////////////////////////////////////
// //Middleware
// exports.checkId = (req, res, next, val) => {
//  if (req.params.id * 1 > tours.length) {
//   return res.status(404).json({
//    status: "fail",
//    message: "Invalid ID",
//   })
//  }

//  next()
// }

//////////////////////////////////
//Controller

const Tour = require('../model/tourModel');
const APIQueryFeature = require('../utils/apiQueryFeature');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');
const factory = require('./factoryHander');

exports.cheapTours = async (req, res, next) => {
  req.query = { price: { lte: '1000' }, rating: { gte: '4' } };
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const feature = new APIQueryFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  //Execute query
  const tours = await feature.query;

  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  return res.status(200).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

exports.getATour = catchAsync(async (req, res, next) => {
  //The less expenses method
  const tour = await Tour.findById(req.params.id)
    .populate({
      path: 'guides',
      select: '-__v -passwordChangedAt',
    })
    .populate('reviews');

  //Null not found error
  if (!tour) {
    return next(new ApiErrorHandler('Not found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        avgPrice: {
          $avg: '$price',
        },
        numRating: { $sum: '$price' },
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //get the year you want to trace the data
  const year = req.query.years;

  const plan = await Tour.aggregate([
    //Unwind(Deconsturcte) the array of dates to return each day of the data
    { $unwind: '$startDates' },
    //match the days required by user
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    //Group the start dates
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    //Sort in ascending order
    { $sort: { numTourStarts: -1 } },
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
