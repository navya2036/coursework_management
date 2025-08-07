import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-modern">
      {/* Main Content */}
      <div className="login-content">
        {/* Left Side - Features */}
        <div className="login-features">
          <div className="features-content">
            <h2 className="features-title">Streamline Your Course Work Management</h2>
            <p className="features-subtitle">Simplify semester-end submissions with our comprehensive faculty portal</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">📚</div>
                <div className="feature-content">
                  <h3>Organize Course Materials</h3>
                  <p>Upload and manage all your course documents in one place</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📄</div>
                <div className="feature-content">
                  <h3>Automated PDF Generation</h3>
                  <p>Generate merged PDFs for easy submission</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <div className="feature-content">
                  <h3>Multi-Subject Management</h3>
                  <p>Handle multiple subjects and academic years effortlessly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2>Faculty Login</h2>
              <p>Enter your credentials to access your course work portal</p>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form-modern">
              <div className="form-group-modern">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`form-input-modern ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              <div className="form-group-modern">
                <label htmlFor="password">Faculty ID</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your faculty ID"
                  className={`form-input-modern ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              
              {error && <div className="error-message-main">{error}</div>}
              
              <button 
                type="submit" 
                className="btn-login-modern" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 