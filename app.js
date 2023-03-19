const express = require('express');
//const morgan = require('morgan');
const tourRouter = require('./routes/tourRouters');

const app = express();

//////////////////////////////////////
//Gobal Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// if (process.env.NODE_ENV === "development") {
//  app.use(morgan("dev"))
// }

//Gobal middle to be used down the pipeline
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);

///////////////////////////////////////////
//Gobal Error handler OPs

//Bad input on route by the user
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `${req.originalUrl} couldn't find it`,
  // });

  //Global handler input message status for bad routes
  const err = new Error(`${req.originalUrl} couldn't find it`);
  err.status = 'fail';
  err.statusCode = '404';

  next(err);
});

//GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  //Access our global error handling object and set defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  //Response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
