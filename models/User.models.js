const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: String,
  name: String,
  password: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id

    delete returnedObjet._id
    delete returnedObjet.__v

    delete returnedObjet.password
  }
})

// eslint-disable-next-line new-cap
const User = new model('User', userSchema)
module.exports = User
