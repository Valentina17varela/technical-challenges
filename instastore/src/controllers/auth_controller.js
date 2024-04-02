const constants = require('../config/config')
const jwt = require('jsonwebtoken')

module.exports = {

  getAccessToken: async (req, res) => {
    const { username, password } = req.body

    if (username !== 'admin' || password !== 'admin') {
      res.status(401).json({ message: 'Invalid credentials' })
    } else {
      const user = { username }
      const accessToken = jwt.sign(user, constants.ACCESS_TOKEN_SECRET)
      res.header('authorization', accessToken).json({ message: 'User authenticated', token: accessToken })
    }
  }

}
