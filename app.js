require('dotenv').config()
require('./mongoDB')

const express = require('express')
const cors = require('cors')
const userRouter = require('./controllers/users.controller')
const notesRouter = require('./controllers/Note.controller')
const loginRouter = require('./controllers/login.controller')
// const noFound = require('./middlewares/noFound')

// init
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
  res.send('hola mundo!')
})

app.use('/api/users', userRouter)
app.use('/api/notes', notesRouter)
app.use('/api/login', loginRouter)
// app.use(noFound)

// starting server
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server runing on port: http://localhost:${PORT}`)
})

// abm
