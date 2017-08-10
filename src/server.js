import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import httpStatus from 'http-status'
import helmet from 'helmet'
import expressValidation from 'express-validation'
import api from './api'
import APIError from './helpers/pretty-error'
import passport from './passport'
import config from './config'
import DB from './helpers/db'

DB.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/kchat`, {useMongoClient: true, keepAlive: 1})
const app = express()
// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use(passport.initialize())

// add api
api(app)

app.all('/', (req, res) => {
  res.json({version: '1.0.0'})
})

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, 0, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, 0, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})
// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  if (config.env === 'development' && err) {
    console.error(err)
  }
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    code: err.code,
    stack: config.env === 'development' ? err.stack : {}
  })
})

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`) // eslint-disable-line no-console
})
