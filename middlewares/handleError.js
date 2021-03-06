const mongoose = require('mongoose')

const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'id used is malformed' }),

  MongoNotConnectedError: () => mongoose.connect(process.env.MONGODB_URI),

  defaultError: res => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.log(error.name)

  const handler =
    ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}
