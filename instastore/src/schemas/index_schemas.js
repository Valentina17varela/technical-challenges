const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    type: [{
      type: Number,
      required: true
    }, {
      type: Number,
      required: true
    }],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  open_time: {
    type: Number,
    required: true
  },
  close_time: {
    type: Number,
    required: true
  }
})

const trackingSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  code_response: {
    type: Number,
    required: true
  },
  execution_time: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

storeSchema.index({ store_name: 1 })

module.exports = { storeSchema, trackingSchema }
