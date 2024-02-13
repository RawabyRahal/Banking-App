import "./App.css"

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Transactions from './components/Transactions';
import Operations from './components/Operations';
import Breakdown from './components/Breakdown';
import Navbar from './components/Navbar';
import axios from 'axios'
import PDfdocument from "./components/PDFdocument";
import { Alert, Snackbar } from "@mui/material";
import MainLayout from "./components/layout/MainLayout";

function App() {
  const [message, setMessage] = useState('')
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

  const [balance, setBalance] = useState(-100)

  function getBalance() {
    return axios.get('http://localhost:8585/balance')
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }

  useEffect(() => {
    const getData = async function () {
      let balanceData = await getBalance()
      setBalance(balanceData.total)
    }
    getData()
  }, [])

  const updateBalance = (value) => {
    const updatedBalance = balance + value
    setBalance(updatedBalance)
  }
  return (
    <>
      <Router>
        <div className="App">
          <Navbar balance={balance} />
          <Routes>
          {/* <Route path='/' element={<MainLayout />}/> */}
            <Route path="/" element={<Transactions />} />
            <Route path="/operations" element={<Operations updateBalance={updateBalance} balance={balance} handleClick={handleClick} setMessage={setMessage}/>} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/report" element={<PDfdocument />} />
          </Routes>
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
      </Router>
    </>
  );
}

export default App;
