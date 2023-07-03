const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Invalid field value: ${value}. please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data, ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  new AppError('Invalid token. Please login again', 401);
};
const handleJWTExpiredError = () => {
  new AppError('Your token has expired! Please login again', 401);
};
const sendErrorDev = (err, req, res) => {
  //APi
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE
  console.log('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log('ERROR 💥', err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong' });
  }
  //RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // programming orunknown error
  console.log('ERROR 💥3', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later!',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // console.log(error);
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    sendErrorProd(err, req, res);
  }
};
