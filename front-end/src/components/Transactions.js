import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Transaction from './Transaction'
import './Transactions.css'
import Select from 'react-select'
import * as consts from '../Config'

export default function Transactions(props) {

    const [transactions, setTransactions] = useState([])
    const [transactionsMonthYear, setTransactionsMonthYear] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedYear, setSelectedYear] = useState('')

    function getTransactions() {
        return axios.get(consts.TRANSACTIONS_URL)
            .then(response => response.data)
            .catch(error => {
                console.error(consts.ERROR_FETCHING_DATA_MESSAGE, error)
            })
    }

    useEffect(() => {
        const getData = async function () {
            let transactionsData = await getTransactions()
            setTransactions(transactionsData)
        }
        getData()
    }, [])

    function getTransactionsByMonthAndYear(month, year) {
        return axios.get(`${consts.TRANSACTIONS_URL}/${month}/${year}`)
            .then(response => response.data)
            .catch(error => {
                console.error(consts.ERROR_FETCHING_DATA_MESSAGE, error)
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


    
    const deleteTransactionById = async (id, updatedTransactions, setUpdatedTransactions) => {
        try {
            await axios.delete(`${consts.TRANSACTIONS_URL}/${id}`)
            props.handleClick()
            props.setMessage(consts.TRANSACTION_DELETED_SUCCESSFULLY_MESSAGE)
            const newTransaction = [...updatedTransactions]
            const transIndex = newTransaction.findIndex(trans => trans._id === id)
            newTransaction.splice(transIndex, 1)
            setUpdatedTransactions(newTransaction)
        } catch (error) {
            console.error(consts.ERROR_DELETE_DATA_MESSAGE, error)
        }
    }

    const deleteTransaction = async (id) => {
        await deleteTransactionById(id, transactions, setTransactions)
    }

    const deleteTransactionByMonthAndYear = async (id) => {
        await deleteTransactionById(id, transactionsMonthYear, setTransactionsMonthYear)
    }

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
                    transactions.map((trans, index) => <Transaction key={index} transaction={trans} deleteTransaction={deleteTransaction} />)
                }
                {selectedMonth.value && selectedYear.value &&
                    transactionsMonthYear.map((trans, index) => <Transaction key={index} transaction={trans} deleteTransaction={deleteTransactionByMonthAndYear} />)
                }
            </div>
        </div>
    )
}
