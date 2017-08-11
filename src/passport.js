import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import _ from 'lodash'
import APIError from './helpers/pretty-error'
import User from './models/user'

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new LocalStrategy({}, (username, password, done) => {
  const fooBar = async () => {
    const user = await User.findOne({ username })
    if (!user || !user.verifyPassword(password)) {
      return done(new APIError('Unauthorized', -1, 401, true))
    }
    return done(null, _.omit(user.toObject(), 'password'))
  }
  fooBar().catch(done)
}))

export default passport
