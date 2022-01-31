const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.models')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid user or password'
    }).end()
  }

  const userToken = {
    id: user._id,
    email: user.email,
    username: user.username
  }

  const token = jwt.sign(userToken, process.env.SECRET)

  res.send({
    name: user.name,
    username: user.username,
    token
  }).end()
})

module.exports = loginRouter
