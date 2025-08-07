import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ teacher, onLogout, onChangeYear }) => {
  const navigate = useNavigate();
  const academicYear = localStorage.getItem('selectedAcademicYear') || '2024-25';

  const handleChangeYear = () => {
    localStorage.removeItem('selectedAcademicYear');
    if (onChangeYear) onChangeYear();
    navigate('/select-year');
  };

  return (
    <nav className="navbar-modern">
      <div className="container">
        <div className="navbar-left">
          <div className="college-brand">
            <div className="graduation-cap-icon">🎓</div>
            <div className="college-name">SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN(A)</div>
          </div>
        </div>
        
        <div className="navbar-right">
          <button
            className="academic-year-btn"
            onClick={handleChangeYear}
            title="Change Academic Year"
          >
            <span className="calendar-icon">📅</span>
            <span>{academicYear}</span>
          </button>
          <div className="welcome-message">
            Welcome, Dr. {teacher?.name || 'John Doe'}
          </div>
          <button onClick={onLogout} className="logout-btn-modern">
            <span className="logout-arrow">→</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 