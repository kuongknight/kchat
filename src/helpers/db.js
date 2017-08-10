import mongoose from 'mongoose'
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise
const Mongoose = {
  connect: (uri, options) => {
    // Create connect to database
    // http://mongoosejs.com/docs/connections.html
    mongoose.connect(uri, options)
    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', () => {
      console.info(`Mongoose default connection open to ${uri}`)
    })
    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      console.error(`Failed to connect to DB ${uri} on startup ${err.message}`)
    })
    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.warning(`Mongoose default connection to DB : ${uri} disconnected`)
    })
    const gracefulExit = () => {
      mongoose.connection.close(() => {
        console.info(`Mongoose default connection with DB : ${uri} is disconnected through app termination`)
        process.exit(0)
      })
    }
    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)
  }
}
export default Mongoose
