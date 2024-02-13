
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './PDFdocument.css'

const PDfdocument = () => {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleGeneratePDF = async () => {
        try {
            if (!startDate || !endDate) return;

            const response = await axios.get(`http://localhost:8585/generatePDF/${startDate}/${endDate}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' })

            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'transactions.pdf'
            link.click()
        } catch (error) {
            console.error('Error in generating PDF', error)
        }
    }

    return (
        <div>
            <h1>Generate PDF Report</h1>
            <div className='start-date'>
                <p className='date'>Start Date: </p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={startDate} onChange={(e) => setStartDate(e)} />
                </LocalizationProvider>

            </div>
            <div className='start-date'>
                <p className='date'>End Date: </p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={endDate} onChange={(e) => setEndDate(e)} />
                </LocalizationProvider>
            </div>
            <button className='pdf-btn' onClick={handleGeneratePDF}>Generate PDF</button>
        </div>
    );
};

export default PDfdocument;
