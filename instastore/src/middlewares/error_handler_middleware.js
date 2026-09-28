const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  const response = err.response || 'Error'
  res.status(status).json({ status, message, response })
}

module.exports = errorHandler
