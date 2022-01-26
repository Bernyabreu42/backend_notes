const indexRouter = require('express').Router()

indexRouter.get('/', (request, response) => {
  response.send(
    '<h1 style="text-align:center">Api Rest con nodeJs express y mongoDB</h1>'
  )
})

module.exports = indexRouter
