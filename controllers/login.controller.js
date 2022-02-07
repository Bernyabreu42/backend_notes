const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.models')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (email === '' || password === '') return res.json({ Error: 'fill in all the fields' })

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
      email: user.email.toLowerCase(),
      username: user.username
    }

    const token = jwt.sign(
      userToken,
      process.env.SECRET,
      {
        expiresIn: 60 * 60 * 24
      }
    )

    res.send({
      name: user.name,
      email: user.email.toLowerCase(),
      token
    }).end()
  } catch (error) {
    console.log(error)
  }
})

module.exports = loginRouter
