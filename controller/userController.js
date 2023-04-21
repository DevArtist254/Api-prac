//const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');
const factory = require('./factoryHander');

const filter = (objBody, ...allowedItems) => {
  const newBody = {};

  Object.keys(objBody).forEach((el) => {
    if (allowedItems.includes(el)) newBody[el] = objBody[el];
  });

  return newBody;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //Check if the user is trying to update the password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiErrorHandler('Passwords cant be updated on this route', 403)
    );
  }
  //filter out unwanted data
  const filteredObj = filter(req.body, 'name', 'email');

  //Update the allowed user info
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  //Id hack
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
