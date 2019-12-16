const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
} = require('./controllers/records')

mongoose.connect(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds041586.mlab.com:41586/balance-sheet`,
  { useNewUrlParser: true }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log('DB connected'))

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', getRecords)
app.post('/', createRecord)
app.put('/:id', updateRecord)
app.delete('/:id', deleteRecord)

app.listen(PORT, () => console.log(`app listening on port ${PORT}`))
