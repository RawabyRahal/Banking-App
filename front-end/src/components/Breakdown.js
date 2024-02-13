import React, { useEffect, useState, useSWR } from 'react'
import axios from 'axios'
import './Breakdown.css'
import BreakdownModal from './BreakdownModal'

// import CircularProgress from '@mui/joy/CircularProgress'


export default function Breakdown() {

    // const filteredCategories = [...new Set(props.transactions.map(transaction => transaction.category))]

    // const total = (category) => {
    //     const filteredCategories = props.transactions.filter(transaction => transaction.category === category);
    //     const total = filteredCategories.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
    //     return total;
    // }


    // const [mountTransactions, setMountTransactions] = useState(false);
    // const fetcher = (...args) => fetch(...args).then((res) => res.json());
    // const { data: breakdown, error } = useSWR(
    //     mountTransactions ? `http://localhost:8585/breakdown` : null,
    //     fetcher
    // )
    // useEffect(() => {
    //     setMountTransactions(true)
    // }, [])

    // if (error) {
    //     console.error('Error fetching data:', error);
    //     return <div>Error fetching data</div>;
    // }

    // if (!breakdown) {
    //     return <CircularProgress/>
    // }

    const [breakdown, setBreakdown] = useState([])
    const [hovered, setHovered] = useState(false)
    const [categoryTransactions, setCategoryTransactions] = useState([])

    function getTransactions() {
        return axios.get('http://localhost:8585/breakdown')
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching data:", error)
            })
    }

    async function getTransactionsByCategory(category) {
        try {
            const response = await axios.get(`http://localhost:8585/transactions/${category}`);
            setCategoryTransactions(response.data);
            setHovered(category);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        const getData = async function () {
            let transactionsData = await getTransactions()
            setBreakdown(transactionsData)
        }
        getData()
    }, [])


    const containerHeight = 20 + breakdown.length * 15

    return (
        <div className='container'>
            <h1>Cash Breakdown</h1>
            <div className='breakdown-container' style={{ height: `${containerHeight}vh` }} onMouseLeave={() => setHovered(false)}>
                {breakdown.map(trans => (
                    <div key={trans._id} onMouseEnter={() => getTransactionsByCategory(trans._id)}>
                        <div className='breakdown'>
                            <div className='text'>Category</div>
                            <div className='value'>{trans._id}</div>

                            <div className='text'>Total</div>
                            {/* <div className='value' style={{ color: trans.total < 0 ? 'red' : 'green' }}>${Math.abs(trans.total)}</div> */}
                            <div className='value' style={{ color: trans.total < 0 ? 'red' : 'green' }}>{trans.total < 0 ? `-$${Math.abs(trans.total)}` : `$${trans.total}`}</div>
                        </div>
                        {hovered && <BreakdownModal transactions={categoryTransactions} />}
                    </div>
                ))}
            </div>
        </div>
    )
}
