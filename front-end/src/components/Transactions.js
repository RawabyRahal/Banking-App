import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Transaction from './Transaction'
import './Transactions.css'
import Select from 'react-select'

const months = [
    {},
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
]
const years = [
    {},
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
    { value: '2010', label: '2010' },
    { value: '2009', label: '2009' },
    { value: '2008', label: '2008' },
    { value: '2007', label: '2007' },
    { value: '2006', label: '2006' },
    { value: '2005', label: '2005' },
    { value: '2004', label: '2004' },
    { value: '2003', label: '2003' },
    { value: '2002', label: '2002' },
    { value: '2001', label: '2001' },
    { value: '2000', label: '2000' },
    { value: '1999', label: '1999' },
    { value: '1998', label: '1998' },
    { value: '1997', label: '1997' },
    { value: '1996', label: '1996' }
]
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
        if(!selectedMonth || !selectedYear)
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
                {/* <div className='month'> */}
                    <p>Month</p>
                    <div className='select'><Select options={months} value={selectedMonth} onChange={(e) => setSelectedMonth(e)} /></div>
                    <p>Year</p>
                    <div className='select'><Select options={years} value={selectedYear} onChange={(e) => setSelectedYear(e)} /></div>
                {/* </div> */}
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
