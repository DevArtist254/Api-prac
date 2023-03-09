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

exports.cheapTours = async (req, res, next) => {
  req.query = { price: { lte: '1000' }, rating: { gte: '4' } };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      message: 'Server error',
    });
  }
};

exports.createATour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    return res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid entry',
    });
  }
};

exports.getATour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid entry',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      //the doc id that we want to find and update
      req.params.id,
      //the update
      req.body,
      //what is beening returned to options
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid entry',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findOneAndDelete(
      //the doc id that we want to find and update
      req.params.id
    );

    return res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid entry',
    });
  }
};
