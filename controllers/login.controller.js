const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.models')

loginRouter.post('/', (req, res, next) => {
  const { username, password } = req.body

  const user = User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    res.status(401).json({
      error: 'invalid user or password'
    })
  }

  res.send({
    name: user.name,
    username: user.username
  })
})

module.exports = loginRouter
