/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//const morgan = require('morgan');
const ApiErrorHandler = require('./utils/apiErrorHandler');
const globalErrorHandlerController = require('./controller/errorController');
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');

const app = express();

// Set security Http headers
app.use(helmet());

//////////////////////////////////////
//Gobal Middlewares
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSql query injection filters out mongodb $
app.use(mongoSanitize());

//Data sanitization against XSS converts code to usable items
app.use(xss());

//Prevent parament pollution
app.use(
  hpp({
    whitelist: [
      //items to be used in our parameter
      'duration',
      'price',
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);

app.use(express.static(`${__dirname}/public`));

//Limit requests from same API
const limiter = rateLimit({
  //100 requests in hr
  max: 100,
  windowMs: 60 * 60 * 1000,
  //error message
  message: 'Too many requests try again in hr',
});

app.use('/api', limiter);

// if (process.env.NODE_ENV === "development") {
//  app.use(morgan("dev"))
// }

//Gobal middle to be used down the pipeline
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

///////////////////////////////////////////
//Gobal Error handler OPs

//Bad input on route by the user
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `${req.originalUrl} couldn't find it`,
  // });

  //Global handler input message status for bad routes
  // const err = new Error(`${req.originalUrl} couldn't find it`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new ApiErrorHandler(`${req.originalUrl} couldn't find it`, 404));
});

//GLOBAL ERROR HANDLER
app.use(globalErrorHandlerController);

module.exports = app;
