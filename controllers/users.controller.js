const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User.models')

// get all users
userRouter.get('/', (req, res, next) => {
  User.find({})
    .then(user => res.json(user))
    .catch(err => next(err))
})

// Find By Id
userRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  User
    .findByIdAndUpdate(id)
    .then(user => res.json(user))
    .catch(err => next(err))
})

// create new User
userRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  // encryptation password
  const bCryptPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    username,
    name,
    password: bCryptPassword
  })

  newUser
    .save()
    .then(user => res.json(user))
    .catch(err => next(err))
})

// update new user
userRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const { username, name, password } = req.body

  // encryptation password
  const bCryptPassword = await bcrypt.hash(password, 10)

  const updateUser = {
    username,
    name,
    password: bCryptPassword
  }

  User.findByIdAndUpdate(id, updateUser, { new: true })
    .then(result => res.json({
      message: 'Update successful!',
      result
    }).status(200)
    ).catch(err => next(err.message))
})

module.exports = userRouter
