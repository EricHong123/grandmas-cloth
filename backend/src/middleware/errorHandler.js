function errorHandler(err, req, res, _next) {
  console.error('=== ERROR ===')
  console.error('URL:', req.method, req.originalUrl)
  console.error('Body:', JSON.stringify(req.body).substring(0, 500))
  console.error('Message:', err.message)
  console.error('Stack:', err.stack?.substring(0, 600))
  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: err.message || 'Internal server error',
  })
}

module.exports = { errorHandler }
