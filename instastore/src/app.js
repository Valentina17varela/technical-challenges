const express = require('express')
const constants = require('./config/config')
const router = require('./routes/index_routes')

const main = () => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/', router.routes())

  app.listen(constants.PORT, () => {
    console.log('InstaStore app listening on port: ', constants.PORT)
  })
}

main()
