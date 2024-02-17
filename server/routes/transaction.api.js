const express = require('express')
const router = express.Router()
const Transaction = require('../model/Transaction')
const Balance = require('../model/Balance')
const PDFDocument = require('pdfkit')
const consts = require('../config.js')

router.get('/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.find({})
        res.status(200).send(transaction)
    }
    catch (error) {
        console.error(consts.ERROR_FETCHING_DATA_MESSAGE, error)
        res.status(404).send({ error: "try again!" });
    }
})

router.post('/transactions', async (req, res) => {
    try {

        const newTransaction = new Transaction(req.body)
        const savedNewTransaction = await newTransaction.save()

        const balance = await Balance.findOne({})
        const total = balance.total + newTransaction.amount
        await Balance.findOneAndUpdate({}, { $set: { total: total } }, { new: true })

        res.status(201).send(savedNewTransaction)
    }
    catch (error) {
        console.error(error)
        res.status(404).send({ error: consts.SAVE_ERROR_MESSAGE })
    }
})


router.delete('/transactions/:id', async (req, res) => {
    const transactionId = req.params.id

    try {
        const deleteTransaction = await Transaction.findOneAndDelete({ _id: transactionId })
        res.status(204).send(deleteTransaction)
        // ive to add a check to see if transaction is found or not
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error)
    }
})


router.get('/breakdown', async (req, res) => {
    try {
        const transactionsTotal = await Transaction.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            }
        ])
        res.status(200).send(transactionsTotal)
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error)
    }
})

router.get('/transactions/:category', async (req, res) => {
    const category = req.params.category
    try {
        const transactionCategoty = await Transaction.aggregate([
            { $match: { category: category } }
        ])
        res.status(200).send(transactionCategoty)
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error)
    }
})

router.get('/transactions/:month/:year', async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    try {
        // console.log(new Date(year + '-' + month + '-01'), new Date(year, month))
        const transactionsByMonthandYear = await Transaction.find(
            {
                date: {
                    $gte: new Date(year + '-' + month + '-01'),
                    $lte: new Date(year, month)
                }
            })
        res.status(200).send(transactionsByMonthandYear)
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error)
    }
})

router.get('/generatePDF/:startDate/:endDate', async (req, res) => {
    const start = req.params.startDate
    const end = req.params.endDate

    try {
        const startDate = new Date(start)
        const endDate = new Date(end)

        const transactions = await Transaction.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
        const doc = new PDFDocument()
        doc.pipe(res)
        doc
            .fontSize(25)
            .text(`Transactions between ${startDate.toDateString()} and ${endDate.toDateString()}`, 100, 100)
            .moveDown()

        transactions.forEach((transaction) => {
            doc.fontSize(12).text(`Date: ${transaction.date.toDateString()} || Vendor: ${transaction.vendor} || Amount: ${consts.CURRENCY_SYMBOL}${transaction.amount}`);
        })
        doc.end()
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error)
    }
})


module.exports = router