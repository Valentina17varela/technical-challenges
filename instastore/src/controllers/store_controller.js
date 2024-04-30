/* eslint-disable camelcase */
const Joi = require('joi')
const Store = require('../models/index_models').storeModel

const validateInput = (req, res, next) => {
  const schema = Joi.object({
    expected_delivery: Joi.date(),
    origin: Joi.object({
      store_name: Joi.string().min(3).required()
    }).required(),
    destination: Joi.object({
      name: Joi.string().min(3),
      address: Joi.string().min(5),
      address_two: Joi.string().min(5),
      description: Joi.string(),
      country: Joi.string().min(3),
      city: Joi.string().min(3),
      state: Joi.string().min(3),
      zip_code: Joi.number(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).required()
  })

  const result = schema.validate(req.body)
  if (result.error) {
    next({ message: result.error.details[0].message, status: 400, response: result.error.details[0].type })
  } else {
    next()
  }
}

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6378 // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180 // Convertimos grados a radianes
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distancia en kilómetros
  return distance
}

const getStores = async (req, res, next) => {
  const { expected_delivery, origin, destination } = req.body

  try {
    let stores = await Store.find({ store_name: origin.store_name }).exec()

    if (stores.length === 0) {
      return next({ message: 'Stores not found', status: 404, response: 'Stores not found' }, [])
    }

    let storesFilter = stores.filter(store => store.state === destination.state)
    if (storesFilter.length === 0) {
      storesFilter = stores.filter(store => store.city === destination.city)
      if (storesFilter.length === 0) {
        storesFilter = stores.filter(store => store.country === destination.country)
        if (storesFilter.length === 0) {
          return next({ message: 'Stores not found nearby', status: 404, response: 'Stores not found nearby' }, [])
        }
      }
    }

    stores = storesFilter

    const expectedDeliveryLocalTime = new Date(expected_delivery)
    const expectedDeliveryTime = expectedDeliveryLocalTime.getUTCHours() * 100 + expectedDeliveryLocalTime.getUTCMinutes()

    const openStores = stores.filter(store => {
      const openTime = parseInt(store.open_time)
      const closeTime = parseInt(store.close_time)
      return expectedDeliveryTime >= openTime && expectedDeliveryTime <= closeTime
    })

    let open = false
    if (openStores.length > 0) {
      stores = openStores
      open = true
    }

    const destLatitude = destination.latitude
    const destLongitude = destination.longitude
    let closestStore = null
    let bestTime = -1
    const averageSpeedDelivery = 40 // km/h
    const currentTime = new Date()
    const currentHour = currentTime.getUTCHours() * 100 + currentTime.getUTCMinutes()

    stores.forEach(store => {
      const coord1 = store.coordinates[0]
      const coord2 = store.coordinates[1]
      const distance = haversine(destLatitude, destLongitude, coord1, coord2)
      let timeTravel = (distance / averageSpeedDelivery) * 60 * 60 // seconds

      if (!open) {
        let timeToOpen = store.open_time - currentHour
        const hourToOpen = (Math.floor(timeToOpen / 100)) * 60 * 60
        const minutesToOpen = (timeToOpen % 100) * 60
        timeToOpen = hourToOpen + minutesToOpen
        if (timeToOpen > 0) {
          timeTravel += timeToOpen
        }
      }

      if (bestTime === -1 || timeTravel < bestTime) {
        bestTime = timeTravel
        closestStore = store
      }
    })

    currentTime.setMilliseconds(currentTime.getMilliseconds() + ((bestTime + 600) * 1000)) // 10 minutes of grace, to prepare the order, etc ...
    const timeDelivery = currentTime.getTime() < expectedDeliveryLocalTime.getTime() ? expectedDeliveryLocalTime.toISOString() : currentTime.toISOString()

    const response = {
      status: 200,
      message: 'Closest store found',
      response: {
        id_store: closestStore._id,
        store_name: closestStore.store_name + ' ' + closestStore.address,
        is_open: open,
        coordinates: closestStore.coordinates,
        nextDeliveryTime: timeDelivery
      }
    }

    return next(null, response)
  } catch (error) {
    return next(error, [])
  }
}

module.exports = {
  getClosestStore: async (req, res, next) => {
    try {
      const sendResponse = (data) => {
        if (!res.headersSent) {
          next(data)
        }
      }

      validateInput(req, res, (error) => {
        if (error) {
          return sendResponse(error)
        }

        getStores(req, res, (error, stores) => {
          if (error) {
            return sendResponse(error)
          }

          res.json({ stores })
        })
      })
    } catch (error) {
      next(error)
    }
  }
}
