const constants = require('../config/config')
const jwt = require('jsonwebtoken')

module.exports = {

  getAccessToken: async (req, res, next) => {
    const { username, password } = req.body

    if (username !== 'admin' || password !== 'admin') {
      next({ message: 'Invalid credentials', status: 401, response: 'Unauthorized' })
    } else {
      const user = { username }
      const accessToken = jwt.sign(user, constants.ACCESS_TOKEN_SECRET)
      res.header('authorization', accessToken).json({ status: 200, message: 'User authenticated', response: { token: accessToken } })
    }
  }

}
