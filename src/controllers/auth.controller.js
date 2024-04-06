const { AuthModel } = require('../models/auth.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const { TOKEN_EXPIRATION_TIME } = require('../utils/constants')
const { v4: uuidv4 } = require('uuid')
const { uploadAndSaveUrl } = require('../utils/imageUpload')

/**
 * Controller function for user signup
 * @param {object} req - request object containing user signup data
 * @param {object} res - response object for sending JSON response
 * @returns {object} - JSON response indicating signup status
 */

const signup = async (req, res) => {
  const { name, email, password, bio, phone, photo } = req.body
  try {
    let user = await AuthModel.find({ email })
    if (!user.length) {
      bcrypt.hash(password, +process.env.SALT, async (err, hash) => {
        if (err) {
          res.status(500).json({
            message: 'Something went wrong'
          })
        } else {
          await AuthModel.create({
            name,
            email,
            password: hash,
            bio: bio || '',
            phone: phone || '',
            photo: photo || ''
          })
          res.status(201).json({ message: 'User Registered Successfully' })
        }
      })
    } else {
      res.status(404).json({ message: 'User already exists' })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong.', error: err.message })
  }
}

/**
 * Controller function for user login
 * @param {object} req - request object containing user login data
 * @param {object} res - response object for sending JSON response
 * @returns {object} - JSON response indicating login status and JWT token
 */
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    let user = await AuthModel.findOne({ email })
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(400).json({
            message: 'Something went wrong.',
            error: 'Invalid email or password.'
          })
        } else {
          if (result) {
            let token = jwt.sign(
              {
                userId: user._id,
                isPublic: user.isPublic,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin
              },
              process.env.SALT,
              {
                expiresIn: TOKEN_EXPIRATION_TIME
              }
            )
            res.status(200).json({ message: 'Login successfully', token })
          } else {
            res.status(401).json({
              message: 'Invalid credentials',
              error: 'Invalid email or password.'
            })
          }
        }
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message })
  }
}

/**
 * Controller function for user logout
 * @param {object} req - Request object containing user ID in headers
 * @param {object} res - Response object for sending JSON response
 * @returns {object} - JSON response indicating logout status
 */
const logout = async (req, res) => {
  try {
    const userId = req.headers.userId
    if (!userId) {
      return res.status(400).send({ msg: 'User ID is missing in headers' })
    }
    let update = { isActive: false }
    let filter = { _id: userId }
    const updatedUser = await AuthModel.findOneAndUpdate(filter, update)
    res.removeHeader('Authorization')
    if (!updatedUser) {
      return res.status(404).send({ msg: 'User not found' })
    }
    res.status(200).send({ msg: 'Logout successful' })
  } catch (err) {
    res.status(500).send({ msg: 'Something went wrong' })
  }
}

/**
 * Controller function for updating user profile
 * @param {object} req - Request object containing user profile data and file (optional)
 * @param {object} res - Response object for sending JSON response
 * @returns {object} - JSON response indicating profile update status and updated user data
 */
const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, email, password, isProfilePublic } = req.body
    const userId = req.headers.userId
    const update = {}
    if (req.file) {
      photoUrl = await uploadAndSaveUrl(req.file)
      if (photoUrl) update.photo = photoUrl
    }
    if (name) update.name = name
    if (bio) update.bio = bio
    if (phone) update.phone = phone
    if (email) update.email = email
    if (password) update.password = password
    if (isProfilePublic) update.isProfilePublic = isProfilePublic
    const filter = { _id: userId }
    const updatedUser = await AuthModel.findOneAndUpdate(filter, update, {
      new: true
    })
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser._id })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

/**
 * Controller function to update user's profile image.
 * @param {object} req - Express request object containing uploaded file.
 * @param {object} res - Express response object for sending JSON response.
 * @returns {object} - JSON response indicating success or failure of image update.
 */
const updateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const userId = req.headers.userId
    const filter = { _id: userId }
    const update = {}
    if (req.file) {
      photoUrl = await uploadAndSaveUrl(req.file)
      if (photoUrl) update.photo = photoUrl
    }
    const updatedUser = await AuthModel.findOneAndUpdate(filter, update, {
      new: true
    })
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(201).json({ message: 'Image updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const base = (req, res) => {
  return res.send('hello')
}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  updateImage,
  base
}
