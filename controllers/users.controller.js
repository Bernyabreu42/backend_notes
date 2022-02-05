const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User.models')

// get all users
userRouter.get('/', async (req, res, next) => {
  const consulta = await User.find({})
  if (consulta.length === 0) return res.json({ message: 'no registered users' })

  User.find({}).populate('notes', { title: 1, content: 1, date: 1 })
    .then(user => res.json(user))
    .catch(err => next(err))
})

// Find By Id
userRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id

  const consulta = await User.findOne({ id })
  if (!consulta) return res.json({ Error: 'user not valid' })

  User
    .findByIdAndUpdate(id)
    .then(user => res.json(user))
    .catch(err => next(err))
})

// create new User
userRouter.post('/', async (req, res, next) => {
  const { email, username, name, password } = req.body

  // encryptation password
  const bCryptPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    email,
    username,
    name,
    password: bCryptPassword
  })

  User.findOne({ email: email }, (_err, doc) => {
    if (doc) {
      res.json({ error: 'Este correo ya esta registrado' })
    } else {
      newUser
        .save()
        .then(user => res.status(201).json(user))
        .catch(err => next(err))
    }
  })
})

// update new user
userRouter.put('/:id', async (req, res, next) => {
  const consulta = await User.find({})
  if (consulta.length === 0) return res.json({ message: 'no registered users' })

  const id = req.params.id
  const { username, name, password } = req.body

  // encryptation password
  const bCryptPassword = await bcrypt.hash(password, 10)

  const updateUser = {
    username,
    name,
    password: bCryptPassword
  }

  if (updateUser.username === '' || updateUser.name === '') return res.json({ Error: 'missing fields to fill' })

  User.findByIdAndUpdate(id, updateUser, { new: true })
    .then(result => res.json({
      message: 'Update successful!',
      result
    }).status(200)
    ).catch(err => next(err.message))
})

module.exports = userRouter
