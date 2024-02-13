const express = require('express')
const router = express.Router()
const Balance = require('../model/Balance')


router.get('/balance', async (req, res) => {
    try {
        // await Balance.deleteMany({})
        const balanceArr = await Balance.find({})
        if (balanceArr.length == 0) {
            const newBalance = new Balance({ total: 0 })
            const savedNewBalance = await newBalance.save()
            res.status(201).send(savedNewBalance)
        }
        else {
            const balance = balanceArr[0]
            res.status(200).send(balance)
        }
    }
    catch (error) {
        console.error(error)
        res.status(404).send(error);
    }
})




module.exports = router