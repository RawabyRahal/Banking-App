import React from 'react'
import './BreakdownModal.css';
import * as consts from '../Config'

export default function BreakdownModal(props) {

    const category = props.transactions[0].category
    return (
        <div>
            <div className="modal">
                <div className='modal-content'>
                    <h1>Category Transactions</h1>
                    <h2> Category: {category} </h2>
                    {props.transactions
                        .map(trans => (
                            <div key={trans._id}>
                                <p>Vendor: {trans.vendor}</p><p>Amount: {trans.amount < consts.ZERO_AMOUNT ? `-${consts.CURRENCY_SYMBOL}${Math.abs(trans.amount)}` : `${consts.CURRENCY_SYMBOL}${trans.amount}`}</p><hr></hr>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
