import React, { useState } from 'react';

const AcademicYearSelector = ({ onYearSelect, teacher }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState('');

  // Generate academic year options (current year and previous years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear.toString().slice(-2)}`);
    }
    
    return years;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError('Please select an academic year');
      return;
    }
    setError('');
    onYearSelect(selectedYear);
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="academic-year-selector">
      <div className="container">
        <div className="year-selector-card">
          <div className="card-header">
            <h2>Welcome, {teacher?.name}!</h2>
            <p>Please select the academic year to view your subjects</p>
          </div>
          
          <form onSubmit={handleSubmit} className="year-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="academicYear">Academic Year</label>
              <select
                id="academicYear"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="form-select"
              >
                <option value="">Select Academic Year (e.g., 2023-24)</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary btn-large">
              Continue to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearSelector;
