const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config/config')

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing authorization header' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' })
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
