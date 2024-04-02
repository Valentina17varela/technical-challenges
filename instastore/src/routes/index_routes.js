const { Router } = require('express')
const storeRoutes = require('./store_routes')
const authRoutes = require('./auth_routes')

const routes = () => {
  const router = Router()

  router.get('/', (req, res) => {
    res.send('Welcome to InstaStore API')
  })

  router.use('/store', storeRoutes)
  router.use('/auth', authRoutes)

  return router
}

module.exports = { routes }
