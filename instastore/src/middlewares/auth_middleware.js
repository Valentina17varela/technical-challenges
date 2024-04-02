const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config/config')

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    next({ message: 'Missing authorization header', status: 401, response: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    next({ message: 'Token not provided', status: 401, response: 'Unauthorized' })
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      next({ message: 'Invalid token', status: 403, response: 'Forbidden' })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
