import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'
import bcrypt from 'bcrypt'

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: String,
  profile: mongoose.Schema.Types.Mixed
})

UserSchema.plugin(timestamps)

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  generateHash: password => bcrypt.hashSync(password, bcrypt.genSaltSync(), null),
  verifyPassword: password => bcrypt.compareSync(password, this.password)
})

UserSchema.pre('save', function (next) {
  var user = this
    // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // generate a salt
  user.password = user.generateHash(user.password)
  next()
})
/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema)
