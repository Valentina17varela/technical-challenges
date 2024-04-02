const router = require('express').Router()
const storeController = require('../controllers/store_controller')
const authenticateToken = require('../middlewares/auth_middleware')

/**
 * @swagger
 * tags:
 *  name: Stores
 *  description: The stores managing API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   StoreInput:
 *      type: object
 *      properties:
 *          expected_delivery:
 *              type: utcDate
 *              description: The expected delivery date
 *          destination:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The name of the store
 *                  address:
 *                      type: string
 *                      description: The address of the store
 *                  address_two:
 *                      type: string
 *                      description: The second address of the store
 *                  country:
 *                      type: string
 *                      description: The country of the store
 *                  city:
 *                      type: string
 *                      description: The city of the store
 *                  state:
 *                      type: string
 *                      description: The state of the store
 *                  zip_code:
 *                      type: string
 *                      description: The zip code of the store
 *                  latitude:
 *                      type: number
 *                      description: The latitude of the store
 *                  longitude:
 *                      type: number
 *                      description: The longitude of the store
 *      required:
 *          - expected_delivery
 *          - destination
 *      example:
 *          expected_delivery: 2021-04-20T00:00:00.000Z
 *          destination:
 *              name: "Valentina Varela Alzate"
 *              address: "Papagayo 238, Mitras Nte., 64320 Monterrey, N.L., México"
 *              address_two: "edificio castillo de la loma apto 202"
 *              description: "la porteria principal del conjunto es la 2"
 *              country: "Mexico"
 *              city: "Monterrey"
 *              state: "Nuevo León"
 *              zip_code: 64320
 *              latitude: 25.714912
 *              longitude: -100.346623
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Store:
 *      type: object
 *      properties:
 *          status:
 *             type: string
 *             description: The status of the response
 *          message:
 *              type: string
 *              description: The message of the response
 *          response:
 *              type: object
 *              properties:
 *                  id_store:
 *                      type: integer
 *                      description: The identifier of the store
 *                  store_name:
 *                      type: string
 *                      description: The name of the store
 *                  is_open:
 *                      type: boolean
 *                      description: The status of the store
 *                  coordinates:
 *                      type: string
 *                      description: The coordinates of the store
 *                  next_delivery_time:
 *                      type: string
 *                      description: The next delivery time
 */

/**
 * @swagger
 * /api/store/closest:
 *  post:
 *      summary: Get the closest store to a given location
 *      tags: [Stores]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/StoreInput'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The closest store
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Store'
 *          40* , 50*:
 *              description: Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                              message:
 *                                  type: string
 *                              response:
 *                                  type: string
 */

router.post('/closest', authenticateToken, storeController.getClosestStore)

module.exports = router
