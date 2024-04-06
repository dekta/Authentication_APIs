const { AuthModel } = require('../models/auth.model')
require('dotenv').config()

/**
 * Controller function to fetch all profiles with pagination based on user role and profile visibility
 * @param {object} req - Request object containing pagination details (page number) and user role indicators in headers
 * @param {object} res - Response object for sending JSON response
 * @returns {object} - JSON response containing profile users for the requested page and user role
 */
const allProfiles = async (req, res) => {
  try {
    const page = req.query.page || 1
    const pageSize = 10
    const skip = (page - 1) * pageSize
    const isAdmin = req.headers.isAdmin
    const isSuperAdmin = req.headers.isSuperAdmin
    let users
    if (isSuperAdmin) {
      users = await AuthModel.find({ isSuperAdmin: false })
        .skip(skip)
        .limit(pageSize)
    } else if (isAdmin) {
      users = await AuthModel.find({ isAdmin: false, isSuperAdmin: false })
        .skip(skip)
        .limit(pageSize)
    } else {
      users = await AuthModel.find(
        {
          isAdmin: false,
          isSuperAdmin: false,
          isProfilePublic: true
        },
        { name: 1, bio: 1, photo: 1 }
      )
        .skip(skip)
        .limit(pageSize)
    }

    if (users) {
      res
        .status(201)
        .json({ message: 'All users with public profiles', users })
    } else {
      return res.status(404).json({ message: 'No public profiles' })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong.', error: err.message })
  }
}

module.exports = {
  allProfiles
}
