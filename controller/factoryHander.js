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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
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

    //Null not found error
    if (!doc) {
      return next(new ApiErrorHandler('Not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.getOne = (Model, pops) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (pops) query.populate(pops);
    const doc = await query;

    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
