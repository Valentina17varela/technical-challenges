const constants = require('../config/config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const validateInput = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  const result = schema.validate(req.body)
  if (result.error) {
    next({ message: result.error.details[0].message, status: 400, response: result.error.details[0].type })
  } else {
    next()
  }
}

module.exports = {

  getAccessToken: async (req, res, next) => {
    try {
      const sendResponse = (data) => {
        if (!res.headersSent) {
          next(data)
        }
      }

      validateInput(req, res, (error) => {
        if (error) {
          return sendResponse(error)
        }
        const { username, password } = req.body
        if (username !== 'admin' || password !== 'admin') {
          next({ message: 'Invalid credentials', status: 401, response: 'Unauthorized' })
        } else {
          const user = { username }
          const accessToken = jwt.sign(user, constants.ACCESS_TOKEN_SECRET)
          res.header('authorization', accessToken).json({ status: 200, message: 'User authenticated', response: { token: accessToken } })
        }
      })
    } catch (error) {
      next(error)
    }
  }

}
