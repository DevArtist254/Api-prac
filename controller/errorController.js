module.exports = (err, req, res, next) => {
  //Access our global error handling object and set defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  //Response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
