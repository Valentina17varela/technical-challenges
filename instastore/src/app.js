const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const constants = require('./config/config')
const router = require('./routes/index_routes')
const errorHandler = require('./middlewares/error_handler_middleware')

const main = () => {
  // Settings
  const app = express()

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Routes
  app.use('/api', router.routes())

  // Documentation
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(constants.SWAGGER_OPTIONS)))

  // Error handler
  app.use(errorHandler)

  app.listen(constants.PORT, () => {
    console.log('InstaStore app listening on port: ', constants.PORT)
  })
}

main()
