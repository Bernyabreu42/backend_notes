const notesRouter = require('express').Router()
const validateToken = require('../middlewares/validateToken')
const Note = require('../models/Note.models')

const User = require('../models/User.models')

// show all notes____________________________________
notesRouter.get('/', async (request, response) => {
  const consulta = await Note.find({})
  if (consulta.length === 0) return response.json({ message: 'No Registered Notes' })

  Note.find({}).populate('user', { username: 1, name: 1 })
    .then(note => response.json(note))
})

// add new note____________________________________
notesRouter.post('/', validateToken, async (req, res, next) => {
  const {
    title,
    content,
    important = false,
    date = new Date()
  } = req.body

  const { userId } = req

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({ error: '"content" field is missing' })
  }

  const newNote = new Note({
    title,
    content,
    date,
    important,
    user: user.id
  })

  try {
    const saveNote = await newNote.save()
    user.notes = user.notes.concat(saveNote._id)
    user.save()
    res.json(saveNote)
  } catch (error) {
    next(error)
  }
})

// search by Id____________________________________
notesRouter.get('/:id', validateToken, async (req, res, next) => {
  const id = req.params.id

  Note.findOne({ _id: id }, (_err, doc) => {
    if (doc === null) {
      return res.json({ Error: 'invalid id' })
    }
  })

  try {
    const result = await Note.findById(id)
    res.json(result)
  } catch (error) {
    res.json({ ...error, msg: 'invalid id' })
  }
})

// Delete by Id____________________________________
notesRouter.delete('/:id', validateToken, async (req, res, next) => {
  const id = req.params.id

  Note.findOne({ _id: id }, (_err, doc) => {
    if (doc === null) {
      return res.json({ Error: 'invalid id' })
    }
  })

  try {
    await Note.findByIdAndRemove(id)
    res.status(204)
  } catch (error) {
    res.json({ ...error, msg: 'invalid id' })
  }
})

// update by Id____________________________________
notesRouter.put('/:id', async (req, res, next) => {
  const consulta = await Note.find({})
  if (consulta.length === 0) return res.json({ message: 'No Registered Notes' })

  const id = req.params.id
  const { title, content, important } = req.body

  const newNote = ({
    title,
    content,
    important: important || false
  })

  if (newNote.content === '') return res.json({ Error: 'missing fields to fill' })

  try {
    const result = await Note.findByIdAndUpdate(id, newNote, { new: true })
    res.json({
      message: 'Update successful!',
      result
    }).status(200)
  } catch (error) {
    res.json({ ...error, msg: 'invalid id' })
  }
})

module.exports = notesRouter
