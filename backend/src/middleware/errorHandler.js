function errorHandler(err, req, res, _next) {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: err.message || 'Internal server error',
  })
}

module.exports = { errorHandler }
