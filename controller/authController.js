/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JSON_SECURITY_KEY, {
    expiresIn: process.env.JSON_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    //passwordChangedAt: req.requestTime,
  });

  const token = createToken(newUser._id);

  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exist
  if (!email || !password) {
    return next(new ApiErrorHandler('Please provide an email & password'), 400);
  }

  //2. Check if user exists && password is correct
  //find the user with the given email
  const user = await User.findOne({ email }).select('+password');

  //Compare the incoming password with the current password
  if (!user || !(await user.passwordCompare(password, user.password))) {
    return next(
      new ApiErrorHandler('The password and the email is incorrect', 401)
    );
  }

  //3. If everthing is okay, send token to then client
  const token = createToken(user._id);
  return res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get the token
  const { authorization } = req.headers;
  let token;

  //Extracting the token
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ApiErrorHandler('Kindly login, to gain access', 401));
  }

  //Verify the token
  const decoded = await jwt.verify(token, process.env.JSON_SECURITY_KEY);

  //Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ApiErrorHandler('Kindly signup, to gain access', 401));
  }

  //user.changedPasswordAfter(decoded.iat);
  //Check if user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiErrorHandler(
        'Password recently changed! Please log in again.',
        401
      )
    );
  }

  //Grant access by setting the user one the request
  req.user = currentUser;

  next();
});

/**
 * Protect
 * Resist to the current roles
 */

exports.restrictTo = (...roles) => (req, res, next) => {
  // Check if the current user role inorder to proceed with the given fn
  // test ['admin', 'lead-guide'] to user role
  if (!roles.includes(req.user.role)) {
    return next(new ApiErrorHandler("You don't have permission", 403));
  }
  next();
};
