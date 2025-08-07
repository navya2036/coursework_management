import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import AcademicYearSelector from './components/AcademicYearSelector';

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Global Header Component
const GlobalHeader = () => (
  <div className="global-header">
    <div className="container">
      <div className="global-header-left">
        <div className="global-header-logo">🎓</div>
        <div>
          <div className="global-header-title">SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN(A)</div>
          <div className="global-header-subtitle">BHIMAVARAM - Faculty Course Work Portal</div>
        </div>
      </div>
      <div className="global-header-right">
        {/* Additional header content can go here */}
      </div>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedYear = localStorage.getItem('selectedAcademicYear');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
    
    if (savedYear) {
      setSelectedAcademicYear(savedYear);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setTeacher(res.data.teacher);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setTeacher(res.data.teacher);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleAcademicYearSelect = (year) => {
    setSelectedAcademicYear(year);
    localStorage.setItem('selectedAcademicYear', year);
  };

  const handleBackToYearSelection = () => {
    setSelectedAcademicYear(null);
    localStorage.removeItem('selectedAcademicYear');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedAcademicYear');
    delete axios.defaults.headers.common['Authorization'];
    setTeacher(null);
    setIsAuthenticated(false);
    setSelectedAcademicYear(null);
  };

  // Only show global header on login and select-year pages
  const showGlobalHeader = ["/login", "/select-year", "/"].includes(location.pathname);
  // Show Navbar only on dashboard and subject details (if you have subject details route, add it here)
  const showNavbar = isAuthenticated && selectedAcademicYear && location.pathname.startsWith("/dashboard");

  if (loading) {
    return (
      <div className="App">
        {showGlobalHeader && <GlobalHeader />}
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {showGlobalHeader && <GlobalHeader />}
      {showNavbar && <Navbar teacher={teacher} onLogout={logout} onChangeYear={handleBackToYearSelection} />}
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            (selectedAcademicYear ? <Navigate to="/dashboard" /> : <Navigate to="/select-year" />) : 
            <Login onLogin={login} />
          } 
        />
        <Route 
          path="/select-year" 
          element={
            isAuthenticated ? 
            (selectedAcademicYear ? <Navigate to="/dashboard" /> : <AcademicYearSelector teacher={teacher} onYearSelect={handleAcademicYearSelect} />) : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            (selectedAcademicYear ? <Dashboard teacher={teacher} academicYear={selectedAcademicYear} onBackToYearSelection={handleBackToYearSelection} /> : <Navigate to="/select-year" />) : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            (selectedAcademicYear ? <Navigate to="/dashboard" /> : <Navigate to="/select-year" />) : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </div>
  );
}

export default App; 