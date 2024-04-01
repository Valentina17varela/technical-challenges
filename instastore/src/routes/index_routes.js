const { Router } = require('express')
const storeRoutes = require('./store_routes')

const routes = () => {
  const router = Router()

  router.get('/', (req, res) => {
    res.send('Welcome to InstaStore API')
  })

  router.use('/store', storeRoutes)

  return router
}

module.exports = { routes }
