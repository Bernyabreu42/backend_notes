const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodeToken
  try {
    decodeToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return res.json({ error })
  }

  const { id: userId } = decodeToken

  req.userId = userId

  next()
}
