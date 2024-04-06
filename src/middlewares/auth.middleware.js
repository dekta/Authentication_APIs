require('dotenv').config()
const jwt = require('jsonwebtoken')

const tokenValidator = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Please enter token' })
  }
  let token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, process.env.SALT, function (err, decoded) {
    if (decoded) {
      req.headers.userId = decoded.userId
      if (decoded.isSuperAdmin) {
        req.headers.isSuperAdmin = decoded.isSuperAdmin
      }
      if (decoded.isAdmin) {
        req.headers.isAdmin = decoded.isAdmin
      }
      next()
    } else {
      res.status(401).json({ message: 'Token expired' })
    }
  })
}

module.exports = tokenValidator
