require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 3000,
  SWAGGER_OPTIONS: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'InstaStore API',
        version: '1.0.0',
        description: 'An API to manage stores and products for our B2B clients'
      },
      servers: [
        {
          url: 'http://localhost:' + (process.env.PORT || 3000)
        }
      ]
    },
    apis: ['./src/routes/*.js']
  }
}
