//Middleware to catch our async errors
// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  //our anonymous fn is used to gain access to the vars of our route handler
  return (req, res, next) => {
    //Our promise used gain access to our catch errors and send them to our gobal next error handler
    fn(req, res, next).catch((err) => next(err));
  };
};
