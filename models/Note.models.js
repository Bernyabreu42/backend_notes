const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id

    delete returnedObjet._id
    delete returnedObjet.__v
  }
})

// eslint-disable-next-line new-cap
const Note = new model('Note', noteSchema)
module.exports = Note
