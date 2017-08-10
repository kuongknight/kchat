import passport from '../passport'

export default (app) => {
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user) => {
      if (error || !user) {
        return res.status(401).json({message: 'Unauthorized!', code: -1})
      }
      return res.status(200).json(user)
    })(req, res, next)
  })
}
