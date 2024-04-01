const router = require('express').Router()
const storeController = require('../controllers/store_controller')

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
 *   Store:
 *      type: object
 *      properties:
 *          id:
 *              type: integer
 *              description: The auto-generated id of the store
 *          name:
 *              type: string
 *              description: The name of the store
 *      required:
 *          - name
 *      example:
 *          id: 1
 *          name: 'Store 1'
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
 *                      $ref: '#/components/schemas/Store'
 *      responses:
 *          200:
 *              description: The closest store
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Store'
 */

router.post('/closest', storeController.getClosestStore)

module.exports = router
