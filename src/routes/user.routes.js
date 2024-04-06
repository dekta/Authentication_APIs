const express = require('express')
const { allProfiles } = require('../controllers/user.controller')
const tokenValidator = require('../middlewares/auth.middleware')
const { base } = require('../controllers/auth.controller')

const userRouter = express.Router()

/**
 * @swagger
 * /v1/profiles:
 *   get:
 *     summary: Get all profiles according to conditions
 *     description: Retrieve all profiles based on pagination and user roles.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '201':
 *         description: All users with public profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: All users with public profiles
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID.
 *                         example: 609bbf6b6a336207582f0a2d
 *                       name:
 *                         type: string
 *                         description: User's name.
 *                         example: John Doe
 *                       bio:
 *                         type: string
 *                         description: User's biography.
 *                         example: A brief description of the user.
 *                       photo:
 *                         type: string
 *                         description: URL to user's photo.
 *                         example: https://example.com/user123/photo.jpg
 *       '404':
 *         description: No public profiles found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: No public profiles
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Something went wrong.
 */

userRouter.get('/v1/profiles', tokenValidator, allProfiles)

userRouter.get('/v1/baseurl', base)

module.exports = { userRouter }
