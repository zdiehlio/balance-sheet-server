const mongoose = require('mongoose')

const { Schema } = mongoose

const RecordSchema = new Schema({
  type: { type: String },
  name: String,
  balance: Number
})

module.exports = mongoose.model('Record', RecordSchema)
