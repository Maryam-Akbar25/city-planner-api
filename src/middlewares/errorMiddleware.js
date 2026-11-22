const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};

export default errorHandler;