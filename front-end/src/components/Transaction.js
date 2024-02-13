import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Transaction.css'
import DeleteIcon from '@mui/icons-material/Delete';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Alert, Snackbar } from '@mui/material';

export default function Transaction(props) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:8585/transactions/${id}`)
      handleClick()
    } catch (error) {
      console.error("Error deleting data:", error)
    }
  }

  return (
    <div className='transaction-card'>
      <div className='transaction'>

        <div className='text'>Vendor</div>
        <div className='value'>{props.transaction.vendor}</div>

        <div className='text'>Category</div>
        <div className='value'>{props.transaction.category}</div>

        <div className='text' >Amount</div>
        <div className='value' style={{ color: props.transaction.amount < 0 ? 'red' : 'green' }}>{props.transaction.amount < 0 ? `-$${Math.abs(props.transaction.amount)}` : `$${props.transaction.amount}`}</div>

      </div>
      <div title='Delete' className='deletebtn' onClick={() => deleteTransaction(props.transaction._id)}><DeleteIcon /></div><br></br>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          The transaction was deleted SUCCESSFULLY
        </Alert>
      </Snackbar>
    </div>
  )
}
