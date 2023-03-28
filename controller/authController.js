const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
