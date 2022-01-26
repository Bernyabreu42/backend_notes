const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connect'))
  .catch(err => console.error('Error: ', err))

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
