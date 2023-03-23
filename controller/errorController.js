const ApiErrorHandler = require('../utils/apiErrorHandler');

const objectIdHandlerDB = (err) => {
  /**
   * "error": {
        "stringValue": "\"hhhh\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "hhhh",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"hhhh\" (type string) at path \"_id\" for model \"Tour\""
    }
   */
  const message = `invalid id for the value:${err.value} and the path:${err.path}`;

  return new ApiErrorHandler(message, 400);
};

const duplicateErrorDB = (err) => {
  /**
   * "error": {
        "driver": true,
        "name": "MongoError",
        "index": 0,
        "code": 11000,
        "keyPattern": {
            "name": 1
        },
        "keyValue": {
            "name": "The Sea Explorer"
        },
        "statusCode": 500,
        "status": "fail"
    }
   */
  const message = `Unique id required ${err.keyValue.name}`;

  return new ApiErrorHandler(message, 400);
};

const validationError = (err) => {
  const errVal = Object.values(err.errors).map((val) => val.message);
  console.log(errVal);

  const message = `invalid message`;

  return new ApiErrorHandler(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //Check for operational error
    //Response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Unknow error
    //1) log it
    console.error('##ERROR##', err);

    //Send a generic response
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  //Access our global error handling object and set defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //Shallow copy
    let error = { ...err };

    //CastError invalid id
    if (error.kind === 'ObjectId') error = objectIdHandlerDB(error);
    if (error.code === 11000) error = duplicateErrorDB(error);
    if (error.name === 'ValidationError') error = validationError(error);

    sendErrorProd(error, res);
  }
};
