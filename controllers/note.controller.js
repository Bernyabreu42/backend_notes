const notesRouter = require('express').Router()
const Note = require('../models/Note.models')

const newNote = require('../models/Note.models')

notesRouter.get('/', (request, response) => {
  newNote.find({}).then(note => {
    response.json(note)
  })
})

// agregar una nueva nota
notesRouter.post('/', (req, res) => {
  const { content, important, date } = req.body

  const newNote = new Note({
    content,
    date: date || new Date(),
    important: important || false
  })

  newNote.save().then(note => res.json(newNote))
})

// buscar por id
notesRouter.get('/:id', (req, res) => {
  console.log(req.params)
  const id = req.params.id
  Note.findById(id).then(note => res.json(note))
})

module.exports = notesRouter
