const notesRouter = require('express').Router()
const { isValidObjectId } = require('mongoose')
const Note = require('../models/Note.models')

const newNote = require('../models/Note.models')

// show all notes
notesRouter.get('/', (request, response) => {
  newNote.find({}).then(note => {
    response.json(note)
  })
})

// add new note
notesRouter.post('/', (req, res, next) => {
  const { content, important, date } = req.body

  const newNote = new Note({
    content,
    date: date || new Date(),
    important: important || false
  })

  newNote.save()
    .then(() => res.json(newNote))
    .catch(err => next(err))
})

// search by Id
notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id)
    .then(note => res.json(note))
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
