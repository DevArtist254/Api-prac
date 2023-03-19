class ApiErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;

    //Maintance of err.stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiErrorHandler;
