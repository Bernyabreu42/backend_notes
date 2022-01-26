const userRouter = require('express').Router()
const User = require('../models/User.models')

userRouter.get('/', (req, res) => {
  User.find({}).then(user => {
    res.json(user)
  })
})

userRouter.post('/', (req, res) => {
  const { username, name, password } = req.body

  const newUser = new User({
    username,
    name,
    password
  })

  newUser.save().then(user => res.json(user))
})

module.exports = userRouter
