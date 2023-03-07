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

exports.cheapTours = async (req, res, next) => {
  req.query = { price: { lte: '1000' }, rating: { gte: '4' } };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Build query
    //1. Build a shallow copy to manipulate
    const copyQuery = { ...req.query };
    //2. Delete excluded field from the shallow copy
    //a.list the fields
    const excludedField = ['sort', 'page', 'limit', 'fields'];
    //b. foreach key found on the copy data delete
    excludedField.forEach((el) => delete copyQuery[el]);

    //3. Implementing equality feature
    // req.query input {duration: {gte : 5}}
    // expected output {duration: {$gte : 5}}
    // data we are adding $ sign gte,gt,lte,lt for mongodb

    //a.Convert to a string
    let copyStringQuery = JSON.stringify(copyQuery);

    //reaasign the string with the replaced matched string
    copyStringQuery = copyStringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    //FILTERING
    let query = Tour.find(JSON.parse(copyStringQuery));

    //SORTING
    //note if -sort by largest to smallest order
    //Check if sorting is implemented
    if (req.query.sort) {
      //convert to mongodb std of ',' to ' '
      const sortby = req.query.sort.split(',').join(' ');
      //reaasign by sorting
      query = query.sort(sortby);
    } else {
      //default soting
      query = query.sort('-createdAt');
    }

    //FIELDS
    //note if -fields by largest to smallest order
    //Check if fields is implemented
    if (req.query.fields) {
      //convert to mongodb std of ',' to ' '
      const sortby = req.query.fields.split(',').join(' ');
      //reaasign by sorting
      query = query.select(sortby);
    } else {
      //default soting
      query = query.select('-__v');
    }

    // PAGINATION from ?page=3&limit=10
    //Default values and values
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    // Formula created page if ?page=3&limit=10 page arangement will be page 1, 1 - 10 results page 2, 11 - 20
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //Execute query
    const tours = await query;

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
