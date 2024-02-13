import React from 'react'
import './BreakdownModal.css';

export default function BreakdownModal(props) {
    const categories = [...new Set(props.transactions.map((trans) => trans.category))]

    return (
        <div>
            <div className="modal">
                <div className='modal-content'>
                    <h1>Category Transactions</h1>
                    {categories.map(category => (
                        <div key={category}>
                            <h2> Category: {category} </h2>
                            {props.transactions
                                .filter(trans => trans.category === category)
                                .map(trans => (
                                    <div key={trans._id}>
                                        <p>Vendor: {trans.vendor}</p><p>Amount: {trans.amount < 0 ? `-$${Math.abs(trans.amount)}` : `${trans.amount}`}</p><hr></hr>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
