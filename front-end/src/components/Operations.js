import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Operations.css'
// import './Operations.scss'
import TextField from "@mui/material/TextField";
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as consts from '../Config'

export default function Operations(props) {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  const handleTransaction = async (transaction) => {

    if (isNaN(amount)) {
      props.handleClick()
      props.setMessage(consts.NOT_A_NUMBER_MESSAGE)
      return
    }
    if (!amount || !vendor || !category) {
      props.handleClick()
      props.setMessage(consts.EMPTY_INPUT_MESSAGE)
      return
    }

    const moneyAmount = transaction === consts.TRANSACTION_DEPOSIT ? amount : -amount
    try {
      await axios.post(consts.TRANSACTIONS_URL, {
        amount: moneyAmount,
        category: category,
        vendor: vendor,
        date: date
      })

      props.updateBalance(Number(moneyAmount))
      setAmount('')
      setVendor('')
      setCategory('')
      navigate('/')
      props.handleClick()
      props.setMessage(consts.TRANSACTION_ADDED_SUCCESSFULLY_MESSAGE)
    }
    catch (error) {
      console.error(consts.ERROR_ADDING_TRANSACTION_MESSAGE, error)
    }
  }

  const handleDeposite = () => {
    handleTransaction(consts.TRANSACTION_DEPOSIT)
  }

  const handleWithdraw = () => {
    if (!amount || !vendor || !category) {
      props.handleClick()
      props.setMessage(consts.EMPTY_INPUT_MESSAGE)
      return
    }
    if (props.balance - amount < consts.INSUFFICIENT_FUNDS_THRESHOLD) {
      props.handleClick()
      props.setMessage(consts.INSUFFICIENT_FUNDS_MESSAGE)
    }
    else {
      handleTransaction(consts.TRANSACTION_WITHDRAW)
    }
  }

  return (
    <div className='operation'>
      <h1>Insert Transactions</h1>
      <TextField
        label="Transaction Amount"
        variant="outlined"
        title='Transaction Amount'
        value={amount} onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        label="Transaction Vendor"
        variant="outlined"
        title='Transaction Vendor'
        value={vendor} onChange={(e) => setVendor(e.target.value)}
      />
      <TextField
        label="Transaction Category"
        variant="outlined"
        title='Category of Transaction'
        value={category} onChange={(e) => setCategory(e.target.value)}
      />
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <div title='Select Date'>
            <DatePicker onChange={date => setDate(date)} />
          </div>
        </LocalizationProvider>
      </div>
      <div className='btns'>
        <button className='deposit' onClick={handleDeposite}>Deposit</button>
        <button className='withdraw' onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  )
}
