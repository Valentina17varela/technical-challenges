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
 *          message:
 *              type: string
 *              description: The message to be displayed
 *          token:
 *              type: string
 *              description: The access token
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example: Invalid credentials
 *     security: []
 */

router.post('/validate', authController.getAccessToken)

module.exports = router
