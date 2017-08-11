import _ from 'lodash'
import passport from '../passport'
import User from '../models/user'
import APIError from '../helpers/pretty-error'
import joi from 'joi'

export default (app) => {
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user) => {
      if (error || !user) {
        return res.status(401).json({message: 'Unauthorized!', code: -1})
      }
      return res.status(200).json(user)
    })(req, res, next)
  })
  app.post('/register', async (req, res, next) => {
    try {
      if (req.user) throw new APIError('NOT ALLOW', -1, 400)
      const schema = joi.object().keys({
        uid: joi.string(),
        username: joi.string().required(),
        password: joi.string().required().min(8),
        profile: joi.object()
      })
      const result = joi.validate(req.body, schema)
      if (!result.error) {
        const user = await new User(result.value).save()
        res.json(_.omit(user, ['password']))
      } else {
        throw new APIError(result.error, -1, 400)
      }
    } catch (error) {
      next(error)
    }
  })
}
