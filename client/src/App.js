import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import AcademicYearSelector from './components/AcademicYearSelector';

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);

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

  const login = async (email, department, facultyId) => {
    try {
      const res = await axios.post('/api/auth/login', { email, department, facultyId });
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

  const signup = async (name, email, password, department, facultyId, subjectId) => {
    try {
      const res = await axios.post('/api/auth/signup', { 
        name, 
        email, 
        password, 
        department,
        facultyId,
        subjectId
      });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setTeacher(res.data.teacher);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated && selectedAcademicYear && <Navbar teacher={teacher} onLogout={logout} />}
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
          path="/signup" 
          element={
            isAuthenticated ? 
            (selectedAcademicYear ? <Navigate to="/dashboard" /> : <Navigate to="/select-year" />) : 
            <Signup onSignup={signup} />
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