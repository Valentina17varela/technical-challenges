const Joi = require('joi')

const validateInput = (req, res, next) => {
  const schema = Joi.object({
    expected_delivery: Joi.date(),
    origin: Joi.object({
      store_name: Joi.string().min(3).required()
    }).required(),
    destination: Joi.object({
      name: Joi.string().min(3),
      address: Joi.string().min(5),
      address_two: Joi.string().min(5),
      description: Joi.string(),
      country: Joi.string().min(3),
      city: Joi.string().min(3),
      state: Joi.string().min(3),
      zip_code: Joi.number(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).required()
  })

  const result = schema.validate(req.body)
  if (result.error) {
    next({ message: result.error.details[0].message, status: 400, response: result.error.details[0].type })
  } else {
    next()
  }
}

module.exports = {
  getClosestStore: async (req, res, next) => {
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

        res.send('Get closest store')
      })
    } catch (error) {
      next(error)
    }
  }
}
