import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { TiThMenu } from 'react-icons/ti';
import { BiSolidReport } from "react-icons/bi";

import './Navbar.css';

const Navbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-toggle" onClick={handleToggleMenu}><TiThMenu /></div>
        <div className="navbar-links">
          <div className="navbar-link"><Link to="/"><AiOutlineTransaction />Transactions</Link></div>
          <div className="navbar-link"><Link to="/operations"><BiMoneyWithdraw />Operations</Link></div>
          <div className="navbar-link"><Link to="/breakdown"><TiThMenu />Breakdown</Link></div>
          <div className="navbar-link"><Link to="/report"><BiSolidReport />Report</Link></div>

        </div>
      </div>
      <div className="balance" style={{ color: props.balance < 500 ? 'red' : 'green' }}>
        Balance: {props.balance < 500 ? `-$${Math.abs(props.balance)}` : `${props.balance}`}
      </div>
    </nav>
  );
};

export default Navbar;
