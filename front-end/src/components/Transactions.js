import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Transaction from './Transaction'
import './Transactions.css'
import Select from 'react-select'
import * as consts from '../Config'

export default function Transactions(props) {
    const [transactions, setTtransactions] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const [transactionsMonthYear, setTransactionsMonthYear] = useState([])

    function getTransactions() {
        return axios.get('http://localhost:8585/transactions')
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching data:", error)
            })
    }

    useEffect(() => {
        const getData = async function () {
            let transactionsData = await getTransactions()
            setTtransactions(transactionsData)
        }
        getData()
    }, [])

    function getTransactionsByMonthAndYear(month, year) {
        return axios.get(`http://localhost:8585/transactions/${month}/${year}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching data:", error)
            })
    }

    useEffect(() => {
        if (!selectedMonth || !selectedYear)
            return;
        const getData = async function () {
            let transactionsMonthYear = await getTransactionsByMonthAndYear(selectedMonth.value, selectedYear.value)
            console.log(transactionsMonthYear)
            if (transactionsMonthYear)
                setTransactionsMonthYear(transactionsMonthYear)
        }
        getData()
    }, [selectedMonth, selectedYear])


    return (
        <div className='transactions'>
            <h1>Transactions</h1>
            <div className='selectList'>
                <p>Month</p>
                <div className='select'><Select options={consts.MONTHS} value={selectedMonth} onChange={(e) => setSelectedMonth(e)} /></div>
                <p>Year</p>
                <div className='select'><Select options={consts.YEARS} value={selectedYear} onChange={(e) => setSelectedYear(e)} /></div>
            </div>

            <div className='trans'>
                {(!selectedMonth.value || !selectedYear.value) &&
                    transactions.map((trans, index) => <Transaction key={index} transaction={trans} />)
                }
                {selectedMonth.value && selectedYear.value &&
                    transactionsMonthYear.map((trans, index) => <Transaction key={index} transaction={trans} />)
                }
            </div>
        </div>
    )
}
