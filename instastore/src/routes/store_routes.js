const router = require('express').Router()
const storeController = require('../controllers/store_controller')

router.get('/closest', storeController.getClosestStore)

module.exports = router
