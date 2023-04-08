/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');
const sendEmail = require('../utils/email');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JSON_SECURITY_KEY, {
    expiresIn: process.env.JSON_EXPIRES_IN,
  });

const createSentToken = (user, statusCode, res) => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  //Cookie creation
  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    //passwordChangedAt: req.requestTime,
  });

  createSentToken(newUser, 201, res);
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

  createSentToken(user, 201, res);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get and check for the User
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiErrorHandler('Not found, kindly signup', 401));
  }

  //Get the reset token
  const resetToken = user.createPasswordResetToken();
  //Allows for persistance of the token to the db
  await user.save({ validateBeforeSave: false });

  // Send it to user's email

  //1) resetURL to be s
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Reset it here: ${resetURL}.\nIf you didn't please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your reset token valid for only 10min',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return next(new ApiErrorHandler('Something went wrong!', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });

  //if token has not expired and there is user, set the new password
  if (!user || user.passwordResetExpires >= Date.now() + 10 * 60 * 1000) {
    return next(new ApiErrorHandler('Something went wrong retry again', 401));
  }

  //Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateBeforeSave: false });

  createSentToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get the user from the collection
  const { user, requestTime } = req;

  const updatedUser = await User.findById(user._id).select('+password');

  if (
    !(await updatedUser.passwordCompare(
      req.body.passwordCurrent,
      updatedUser.password
    ))
  ) {
    return new ApiErrorHandler('Vaildation error, login again', 403);
  }
  //Check if posted current password is correct
  const { password, passwordConfirm } = req.body;
  updatedUser.password = password;
  updatedUser.passwordConfirm = passwordConfirm;
  updatedUser.passwordChangedAt = requestTime;

  //if so, updated password
  await updatedUser.save();

  createSentToken(updatedUser, 201, res);
});
