const { AuthModel } = require('../models/auth.model')
require('dotenv').config()

/**
 * Controller function for updating user role to admin
 * @param {object} req - Request object containing user ID in headers and admin ID in params
 * @param {object} res - Response object for sending JSON response
 * @returns {object} - JSON response indicating admin update status
 */

const makeAdmin = async (req, res) => {
  try {
    const userId = req.headers.userId
    const adminId = req.params.id
    const user = await AuthModel.findOne({ _id: userId })

    if (user && user.isSuperAdmin) {
      await AuthModel.findOneAndUpdate({ _id: adminId }, { isAdmin: true })
      res.status(201).json({ message: 'Admin updated' })
    } else {
      return res
        .status(404)
        .json({ message: 'Not valid credentials to update admin details' })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong.', error: err.message })
  }
}

module.exports = {
  makeAdmin
}
