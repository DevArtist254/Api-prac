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

module.exports = app;
