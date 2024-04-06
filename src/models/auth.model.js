const mongoose = require('mongoose')

const authSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    photo: { type: String },
    phone: { type: String },
    isProfilePublic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const AuthModel = mongoose.model('user', authSchema)

module.exports = { AuthModel }
