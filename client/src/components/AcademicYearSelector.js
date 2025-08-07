import React, { useState } from 'react';

const AcademicYearSelector = ({ onYearSelect }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError('Please enter the academic year');
      return;
    }
    setError('');
    onYearSelect(selectedYear);
  };

  return (
    <div className="academic-year-modern-bg">
      <div className="academic-year-modern-center">
        <div className="academic-year-modern-card">
          <div className="academic-year-modern-icon">
            <span role="img" aria-label="calendar">📅</span>
          </div>
          <h2 className="academic-year-modern-title">Select Academic Year</h2>
          <p className="academic-year-modern-subtitle">
            Choose the academic year to access your course dashboard
          </p>
          <form onSubmit={handleSubmit} className="academic-year-modern-form">
            <div className="academic-year-modern-form-group">
              <label htmlFor="academicYear" className="academic-year-modern-label">Academic Year</label>
              <input
                id="academicYear"
                type="text"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`academic-year-modern-input${error ? ' error' : ''}`}
                placeholder="e.g., 2024-25"
                autoFocus
              />
              <div className="academic-year-modern-helper">Format: YYYY-YY (e.g., 2024-25)</div>
              {error && <div className="academic-year-modern-error">{error}</div>}
            </div>
            <button type="submit" className="academic-year-modern-btn">
              Continue to Dashboard <span className="academic-year-modern-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearSelector;
