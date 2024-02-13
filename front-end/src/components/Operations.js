import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Operations.css'
// import './Operations.scss'
import TextField from "@mui/material/TextField";
import axios from 'axios'
import { Alert, Snackbar } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Operations(props) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')

  const handleTransaction = async (transaction) => {

    if (isNaN(amount)) {
      handleClick()
      setMessage('Amount it is NOT a number')
      return
    }
    if (amount.length === 0 || vendor.length === 0 || category.length === 0) {
      handleClick()
      setMessage('Input field is EMPTY!')
      return
    }

    const moneyAmount = transaction === 'deposit' ? amount : -amount
    try {
      await axios.post('http://localhost:8585/transactions', {
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
      props.setMessage("The transaction was added SUCCESSFULLY")
    }
    catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  const handleDeposite = () => {
    handleTransaction('deposit')
  }



  const handleWithdraw = () => {
    if (amount.length === 0 || vendor.length === 0 || category.length === 0) {
      handleClick()
      setMessage('input is EMPTY!')
      return
    }
    if (props.balance - amount < 500) {
      handleClick()
      setMessage("Insufficient Funds")
    }
    else {
      handleTransaction('withdraw')
    }
  }

  return (
    <div className='operation'>
      <h1>Insert Transactions</h1>
      <TextField
        label="Transaction Amount"
        variant="outlined"
        value={amount} onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        label="Transaction Vendor"
        variant="outlined"
        value={vendor} onChange={(e) => setVendor(e.target.value)}
      />
      <TextField
        className="search"
        label="Transaction Category"
        variant="outlined"
        value={category} onChange={(e) => setCategory(e.target.value)}
      />
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker onChange={date => setDate(date)} />
        </LocalizationProvider>
      </div>
      <div className='btns'>
        <button className='deposit' onClick={handleDeposite}>Deposit</button>
        <button className='withdraw' onClick={handleWithdraw}>Withdraw</button>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
