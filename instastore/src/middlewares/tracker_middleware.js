const Tracking = require('../models/index_models').trackingModel

const requestTracker = (req, res, next) => {
  const start = Date.now()

  let responseBody = ''
  const originalSend = res.send
  res.send = function (body) {
    responseBody = body
    originalSend.call(this, body)
  }

  res.on('finish', async () => {
    const end = Date.now()
    const executionTime = (end - start) / 1000

    const trackingObject = new Tracking({
      request: req.body,
      response: responseBody,
      code_response: res.statusCode,
      execution_time: executionTime,
      date: new Date()
    })

    try {
      await trackingObject.save()
    } catch (error) {
      console.error('Error saving tracking object:', error)
    }
  })

  next()
}

module.exports = requestTracker
