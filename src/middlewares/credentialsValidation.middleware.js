const { BIO_LENGTH, PHOTO_URL_LENGTH } = require('../utils/constants')

const validate = async (req, res, next) => {
  let { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(401).send({ msg: 'Please fill all details' })
  } else if (password.length < 8) {
    res.status(401).send({ msg: 'Please choose strong password' })
  } else {
    next()
  }
}

const profileExtraDataValidate = async (req, res, next) => {
  let { bio, photo, phone } = req.body

  // Validate bio if provided
  if (bio && (typeof bio !== 'string' || bio.length > BIO_LENGTH)) {
    return res.status(400).json({ message: 'Invalid bio' })
  }

  // Validate photo if provided
  if (photo && (typeof photo !== 'string' || photo.length > PHOTO_URL_LENGTH)) {
    return res.status(400).json({ message: 'Invalid photo URL' })
  }

  // Validate phone if provided
  if (phone && (typeof phone !== 'string' || phone.length > PHONE_NUM_LENGTH)) {
    return res.status(400).json({ message: 'Invalid phone number' })
  }
  next()
}

module.exports = { validate, profileExtraDataValidate }
