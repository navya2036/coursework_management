import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ teacher, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          Teacher Dashboard
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <span>Welcome, {teacher?.name}</span>
          </li>
          <li>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 