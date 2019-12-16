const mongoose = require('mongoose').set('debug', true)
require('../models/Record')

const getRecords = async (req, res) => {
  const { Record } = mongoose.models
  try {
    const records = await Record.find({})
    const totals = calculateTotals(records)
    console.log(totals)
    res.status(200).send({ success: true, result: records, totals })
  } catch (error) {
    res
      .status(500)
      .send({ error, result: 'Something went wrong with our server' })
  }
}

const createRecord = async (req, res) => {
  const { Record } = mongoose.models
  try {
    const { body } = req
    const balanceDiff = calculateBalanceDiff(body)
    body.balance = balanceDiff
    const record = await Record.create(req.body)
    const records = await Record.find({})
    const totals = calculateTotals(records)
    res.status(200).send({ success: true, result: record, totals })
  } catch (error) {
    res
      .status(500)
      .send({ error, result: 'Something went wrong with our server' })
  }
}

const updateRecord = async (req, res) => {
  const { Record } = mongoose.models
  try {
    const { body } = req
    const balanceDiff = calculateBalanceDiff(body)
    body.balance = balanceDiff
    const record = await Record.findByIdAndUpdate(req.params.id, body, {
      new: true
    })
    const records = await Record.find({})
    const totals = calculateTotals(records)
    res.status(200).send({ success: true, result: record, totals })
  } catch (error) {
    res
      .status(500)
      .send({ error, result: 'Something went wrong with our server' })
  }
}

const deleteRecord = async (req, res) => {
  const { Record } = mongoose.models
  try {
    const { id } = req.params
    const record = await Record.findByIdAndDelete(id).exec()
    const records = await Record.find({})
    const totals = calculateTotals(records)
    res.status(200).send({
      success: true,
      result: `${record} deleted successfully`,
      totals
    })
  } catch (error) {
    res
      .status(500)
      .send({ error, result: 'Something went wrong with our server' })
  }
}

const calculateBalanceDiff = doc => {
  return doc.type === 'Liability' && Math.sign(doc.balance) > 0
    ? doc.balance * -1
    : doc.balance
}

const calculateTotals = docs => {
  const totals = { assetTotal: 0, liabilityTotal: 0, netWorth: 0 }
  docs.map(entry => {
    entry.type === 'Asset'
      ? (totals.assetTotal += entry.balance)
      : (totals.liabilityTotal += entry.balance)
    return (totals.netWorth += entry.balance)
  })
  return totals
}

module.exports = { getRecords, createRecord, updateRecord, deleteRecord }
