const router = require('express').Router()
const authController = require('../controllers/auth_controller')

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentication endpoints
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *      type: object
 *      properties:
 *          username:
 *              type: string
 *              description: The username of the user
 *          password:
 *              type: string
 *              description: The password of the user
 *      required:
 *          - username
 *          - password
 *      example:
 *          username: 'admin'
 *          password: 'admin'
 *   UserAuth:
 *      type: object
 *      properties:
 *          status:
 *             type: string
 *             description: The status of the request
 *          message:
 *              type: string
 *              description: The message to be displayed
 *          response:
 *              type: object
 *              description: The response object
 *              properties:
 *                  token:
 *                      type: string
 *                      description: The access token
 */

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validate user credentials and return an access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/UserAuth'
 *       40* , 50*:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: string
 *                 message:
 *                   type: string
 *                 response:
 *                  type: string
 *     security: []
 */

router.post('/validate', authController.getAccessToken)

module.exports = router
