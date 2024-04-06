const express = require('express')
const {
  validate,
  profileExtraDataValidate
} = require('../middlewares/credentialsValidation.middleware')
const {
  signup,
  login,
  logout,
  updateProfile,
  updateImage
} = require('../controllers/auth.controller')
const tokenValidator = require('../middlewares/auth.middleware')
const multer = require('multer')
const { IMAGE_SIZE } = require('../utils/constants')
const passport = require('passport')
require('../controllers/googleAuth.controller')(passport)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: IMAGE_SIZE
  }
})
const authRouter = express.Router()

/**
 * @swagger
 * /user/v1/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user with the provided credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: 12345678
 *     responses:
 *       '201':
 *         description: User Registered Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: User Registered Successfully
 *       '404':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: User already exists
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal server error occurred.
 */

authRouter.post('/v1/register', validate, profileExtraDataValidate, signup)

/**
 * @swagger
 * /user/v1/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: 12345678
 *     responses:
 *       '200':
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token .
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       '400':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid email or password.
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: User with this email does not exist.
 *       '500':
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal server error occurred.
 */
authRouter.post('/v1/login', login)

// authRouter.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// )

// authRouter.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/user/v1/login' }),
//   (req, res) => {
//     res.redirect('/v1/baseurl')
//   }
// )

/**
 * @swagger
 * /user/v1/logout:
 *   get:
 *     summary: Log out user
 *     description: Logs out the user by setting their `isActive` status to false.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful logout
 *                   example: Logout successful
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating missing user ID in headers
 *                   example: User ID is missing in headers
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating user not found
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating server error
 *                   example: Something went wrong
 */
authRouter.get('/v1/logout', tokenValidator, logout)

/**
 * @swagger
 * /user/v1/updateprofile:
 *   put:
 *     summary: Update user profile
 *     description: Update user profile information including name, bio, phone, email, password,photo and profile visibility.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               bio:
 *                 type: string
 *                 description: Biography of the user.
 *               phone:
 *                 type: string
 *                 description: Phone number of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *               isProfilePublic:
 *                 type: boolean
 *                 description: User's preference for profile visibility (optional).
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo file (optional).
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Profile updated successfully
 *                 user:
 *                   type: string
 *                   description: ID of the updated user.
 *                   example: 607b5c0eabf72c1034e5e103
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Something went wrong
 */
authRouter.put(
  '/v1/updateprofile',
  upload.single('file'),
  tokenValidator,
  updateProfile
)

/**
 * @swagger
 * /user/v1/updateimage:
 *   patch:
 *     summary: Update user profile image
 *     description: Update the profile image of the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to be uploaded.
 *     responses:
 *       '201':
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Image updated successfully
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: No file uploaded
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Something went wrong
 */
authRouter.patch(
  '/v1/updateimage',
  upload.single('file'),
  tokenValidator,
  updateImage
)

module.exports = { authRouter }
