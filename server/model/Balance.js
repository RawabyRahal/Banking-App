const mongoose = require('mongoose')
const Schema = mongoose.Schema

const balanceSchema  = new Schema({
    total : Number
})


const Balance = mongoose.model("balance", balanceSchema)
module.exports = Balance