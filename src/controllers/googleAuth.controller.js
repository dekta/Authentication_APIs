const { AuthModel } = require('../models/auth.model')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/user/google/callback'
      },
      (profile, done) => {
        AuthModel.findOne({ email: profile.emails[0].value })
        done(null, profile.emails[0].value)
      }
    )
  )
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, user) {
      done(err, user)
    })
  })
}
