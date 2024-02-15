import React from 'react'
import './Transaction.css'
import DeleteIcon from '@mui/icons-material/Delete';
import * as consts from '../Config'


export default function Transaction(props) {
  
  return (
    <div className='transaction-card'>
      <div className='transaction'>

        <div className='text'>Vendor</div>
        <div className='value'>{props.transaction.vendor}</div>

        <div className='text'>Category</div>
        <div className='value'>{props.transaction.category}</div>

        <div className='text' >Amount</div>
        <div className='value' style={{ color: props.transaction.amount < consts.ZERO_AMOUNT ? consts.RED : consts.GREEN}}>{props.transaction.amount < consts.ZERO_AMOUNT ? `-${consts.CURRENCY_SYMBOL}${Math.abs(props.transaction.amount)}` : `${consts.CURRENCY_SYMBOL}${props.transaction.amount}`}</div>

      </div>
      <div title='Delete' className='deletebtn' onClick={()=>props.deleteTransaction(props.transaction._id)}><DeleteIcon /></div><br></br>

      
    </div>
  )
}
