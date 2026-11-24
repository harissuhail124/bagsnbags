module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.details ? `${err.message}: ${err.details}` : (err.message || 'Internal Server Error');
  res.status(status).json({
    error: {
      message,
      statusCode: status,
      details: err.details,
    },
  });
};
