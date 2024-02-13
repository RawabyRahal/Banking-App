const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const transactionAPI = require('./routes/transaction.api')
const balanceAPI = require('./routes/balance.api')

const app = express()
const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/transactionsDB").catch((err)=> console.log(err))

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/', transactionAPI)
app.use('/', balanceAPI)


const port = 8585
app.listen(port, function () {
    console.log(`Server running on port ${port}`)
})