import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectDetails from './SubjectDetails';

const Dashboard = ({ teacher, academicYear, onBackToYearSelection }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    subjectCode: '',
    subjectName: '',
    regulation: '',
    department: ''
  });

  useEffect(() => {
    if (academicYear) {
      fetchSubjects();
    }
  }, [academicYear]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`/api/subjects?academicYear=${academicYear}`);
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to load subjects');
      console.error('Subjects fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectData = { ...formData, academicYear };
      if (editingSubject) {
        await axios.put(`/api/subjects/${editingSubject._id}`, subjectData);
        setEditingSubject(null);
      } else {
        await axios.post('/api/subjects', subjectData);
      }
      setFormData({
        year: '',
        semester: '',
        subjectCode: '',
        subjectName: '',
        regulation: '',
        department: ''
      });
      setShowAddForm(false);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      year: subject.year,
      semester: subject.semester,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      regulation: subject.regulation,
      department: subject.department || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`/api/subjects/${subjectId}`);
        fetchSubjects();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSubject(null);
    setFormData({
      year: '',
      semester: '',
      subjectCode: '',
      subjectName: '',
      regulation: '',
      department: ''
    });
  };

  const handleSubjectUpdate = (updatedSubject) => {
    setSubjects(subjects.map(subject => 
      subject._id === updatedSubject._id ? updatedSubject : subject
    ));
  };

  const handleViewSubject = (subject) => {
    setSelectedSubject(subject._id);
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Loading Dashboard...</h1>
          </div>
        </div>
      </div>
    );
  }

    // If a subject is selected, show the subject details page
  if (selectedSubject) {
    return (
      <SubjectDetails
        subjectId={selectedSubject}
        onBack={handleBackToDashboard}
        onUpdate={handleSubjectUpdate}
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Welcome back, {teacher?.name}!</h1>
              <p>Academic Year: <strong>{academicYear}</strong> | Manage your subjects here</p>
            </div>
            <button 
              className="btn btn-secondary btn-back"
              onClick={onBackToYearSelection}
              title="Change Academic Year"
            >
              ← Change Year
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="close-btn">&times;</button>
          </div>
        )}

        <div className="subjects-section">
          <div className="subjects-header">
            <h2>My Subjects ({subjects.length})</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Subject
            </button>
          </div>

          {showAddForm && (
            <div className="subject-form">
              <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2nd Year, 3rd Year"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Subject Code</label>
                    <input
                      type="text"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleInputChange}
                      placeholder="e.g., CS101, MATH201"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject Name</label>
                    <input
                      type="text"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      placeholder="e.g., Data Structures"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Regulation</label>
                    <input
                      type="text"
                      name="regulation"
                      value={formData.regulation}
                      onChange={handleInputChange}
                      placeholder="e.g., R18, R20"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science, Mathematics"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingSubject ? 'Update Subject' : 'Add Subject'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="subjects-grid">
            {subjects.length === 0 ? (
              <div className="no-subjects">
                <p>No subjects added yet. Click "Add Subject" to get started!</p>
              </div>
            ) : (
                             subjects.map((subject) => (
                 <div key={subject._id} className="subject-card">
                   <div className="subject-header">
                     <div className="subject-info">
                       <h3>{subject.subjectName}</h3>
                       <p className="subject-class">Class: {subject.class}</p>
                     </div>
                     <div className="subject-actions">
                       <button 
                         className="btn btn-small btn-primary"
                         onClick={() => handleViewSubject(subject)}
                       >
                         Course Work
                       </button>
                       <button 
                         className="btn btn-small btn-secondary"
                         onClick={() => handleEdit(subject)}
                       >
                         Edit
                       </button>
                       <button 
                         className="btn btn-small btn-danger"
                         onClick={() => handleDelete(subject._id)}
                       >
                         Delete
                       </button>
                     </div>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 