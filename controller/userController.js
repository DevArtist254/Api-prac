//const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findOneAndDelete(
    //the doc id that we want to find and update
    req.user.id
  );

  //Null not found error
  if (!updatedUser) {
    return next(new ApiErrorHandler('Not found', 404));
  }

  if (
    !(await updatedUser.passwordCompare(
      req.body.passwordCurrent,
      updatedUser.password
    ))
  ) {
    return new ApiErrorHandler('Vaildation error, login again', 403);
  }

  return res.status(204).json({
    status: 'success',
  });
});
