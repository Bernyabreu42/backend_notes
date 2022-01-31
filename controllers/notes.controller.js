const notesRouter = require('express').Router()
const { isValidObjectId } = require('mongoose')
const Note = require('../models/Note.models')
const jwt = require('jsonwebtoken')

const newNote = require('../models/Note.models')
const User = require('../models/User.models')

// show all notes
notesRouter.get('/', (request, response) => {
  newNote.find({}).populate('user', { username: 1, name: 1 })
    .then(note => response.json(note))
})

// add new note
notesRouter.post('/', async (req, res, next) => {
  const {
    content,
    important = false,
    date = new Date(),
    user
  } = req.body

  const authorization = req.get('authorization')
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodeToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodeToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = await User.findById(user)

  if (!content) {
    return res.status(400).json({ error: 'requerid "content" field is missing' })
  }

  const newNote = new Note({
    content,
    date,
    important,
    user: userId.id
  })

  newNote.save()
    .then(() => {
      userId.notes = userId.notes.concat(newNote._id)
      userId.save()
      res.json(newNote)
    })
    .catch(err => next(err))
})

// search by Id
notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id)
    .then(note => {
      if (note === null) return res.json({ Error: 'Nota no encontrada' })
      res.json(note)
    })
    .catch(err => next(err))
})

// Delete by Id
notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  console.log(!isValidObjectId(id))

  if (!isValidObjectId(id)) throw new Error('Falta el id')

  Note.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err.mesasge))
})

// update by Id
notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { content, important } = req.body

  const newNote = ({
    content,
    important: important || false
  })

  Note.findByIdAndUpdate(id, newNote, { new: true })
    .then(result => res.json({
      message: 'Update successful!',
      result
    }).status(200)
    ).catch(err => next(err.message))
})

module.exports = notesRouter
