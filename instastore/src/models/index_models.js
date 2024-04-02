const mongoose = require('mongoose')
const { storeSchema, trackingSchema } = require('../schemas/index_schemas')

const storeModel = mongoose.model('Stores', storeSchema)
const trackingModel = mongoose.model('Tracking', trackingSchema)

module.exports = {
  storeModel,
  trackingModel
}
