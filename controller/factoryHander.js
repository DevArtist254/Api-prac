const catchAsync = require('../utils/catchAsync');
const ApiErrorHandler = require('../utils/apiErrorHandler');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete(
      //the doc id that we want to find and update
      req.params.id
    );

    //Null not found error
    if (!doc) {
      return next(new ApiErrorHandler('Not found', 404));
    }

    return res.status(204).json({
      status: 'success',
    });
  });
