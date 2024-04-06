const express = require('express')
const tokenValidator = require('../middlewares/auth.middleware')
const { makeAdmin } = require('../controllers/admin.controller')
const adminRouter = express.Router()

/**
 * @swagger
 * /admin/v1/make-admin/{id}:
 *   get:
 *     summary: Make user admin
 *     description: Make the specified user an admin if the requester is a super admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to be made admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '201':
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Admin updated
 *       '404':
 *         description: Not valid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Not valid credentials to update admin details
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

adminRouter.get('/v1/make-admin/:id', tokenValidator, makeAdmin)

module.exports = { adminRouter }
