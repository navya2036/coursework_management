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
    department: '',
    class: ''
  });

  useEffect(() => {
    if (academicYear) {
      fetchSubjects();
    }
  }, [academicYear]);

  // Add sample data for demonstration (remove this in production)
  useEffect(() => {
    if (subjects.length === 0 && !loading) {
      // Uncomment the following lines to add sample data for demonstration
      /*
      const sampleSubjects = [
        {
          _id: 'sample1',
          subjectName: 'Machine Learning',
          subjectCode: 'CS501',
          semester: '5',
          year: '3rd Year',
          department: 'Computer Science',
          class: 'CSE-A',
          regulation: 'R20'
        },
        {
          _id: 'sample2',
          subjectName: 'Data Structures',
          subjectCode: 'CS402',
          semester: '4',
          year: '2nd Year',
          department: 'Computer Science',
          class: 'CSE-B',
          regulation: 'R20'
        }
      ];
      setSubjects(sampleSubjects);
      */
    }
  }, [subjects.length, loading]);

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
        department: '',
        class: ''
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
      department: subject.department || '',
      class: subject.class || ''
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
      department: '',
      class: ''
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
      <div className="dashboard-modern">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
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
    <div className="dashboard-modern">
      <div className="container">
        <div className="course-dashboard-header">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Course Dashboard</h1>
            <p className="dashboard-subtitle">Manage your subjects and course work for 2024-25</p>
          </div>
          <button 
            className="add-subject-btn"
            onClick={() => setShowAddForm(true)}
          >
            <span className="plus-icon">+</span>
            Add Subject
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="close-btn">&times;</button>
          </div>
        )}

        {showAddForm && (
          <div className="subject-form-modern">
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
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    placeholder="e.g., CSE-A, CSE-B"
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

        <div className="subjects-grid-modern">
          {subjects.length === 0 ? (
            <div className="no-subjects">
              <p>No subjects added yet. Click "Add Subject" to get started!</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject._id} className="subject-card-modern">
                <div className="subject-card-header">
                  <div className="subject-title-section">
                    <h3 className="subject-title">{subject.subjectName}</h3>
                    <p className="subject-code">{subject.subjectCode}</p>
                  </div>
                  <div className="semester-tag">
                    {subject.semester}th Semester
                  </div>
                </div>
                
                <div className="subject-details-list">
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{subject.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{subject.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Class:</span>
                    <span className="detail-value">{subject.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Regulation:</span>
                    <span className="detail-value">{subject.regulation}</span>
                  </div>
                </div>
                
                <div className="subject-card-actions">
                  <button 
                    className="course-work-btn"
                    onClick={() => handleViewSubject(subject)}
                  >
                    <span className="book-icon">📚</span>
                    Course Work
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(subject)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(subject._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 