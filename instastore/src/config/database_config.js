const constants = require('../config/config')
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const url = `mongodb+srv://${constants.DB_USER}:${constants.DB_PASSWORD}@${constants.DB_HOST}/?retryWrites=true&w=majority`
    await mongoose.connect(url)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDB
