import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SubjectSections from './SubjectSections';

const SubjectDetails = ({ subjectId, onBack, onUpdate }) => {
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubjectDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/subjects/${subjectId}`);
      setSubject(response.data);
    } catch (err) {
      setError('Failed to load subject details');
      console.error('Subject details fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchSubjectDetails();
  }, [fetchSubjectDetails]);

  const handleSubjectUpdate = (updatedSubject) => {
    setSubject(updatedSubject);
    onUpdate(updatedSubject);
  };

  if (loading) {
    return (
      <div className="subject-details-page">
        <div className="container">
          <div className="loading">Loading subject details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subject-details-page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="subject-details-page">
        <div className="container">
          <div className="error">Subject not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-details-page">
      <div className="container">
        <div className="subject-details-header-vertical">
          <div className="back-button-row">
            <button className="btn btn-back-compact" onClick={onBack}>
              <span className="back-arrow-small">←</span>
            </button>
          </div>
          <div className="title-row">
            <h1 className="subject-title-main">{subject.subjectName} - Course Work</h1>
          </div>
        </div>

        <div className="subject-details-content">
          <div className="subject-info-card">
            <h2>Course Information</h2>
            <div className="subject-info-grid">
              <div className="info-item">
                <label>Subject Code:</label>
                <span>{subject.subjectCode}</span>
              </div>
              <div className="info-item">
                <label>Year:</label>
                <span>{subject.year}</span>
              </div>
              <div className="info-item">
                <label>Semester:</label>
                <span>{subject.semester}</span>
              </div>
              <div className="info-item">
                <label>Regulation:</label>
                <span>{subject.regulation}</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{new Date(subject.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <SubjectSections 
            subject={subject} 
            onUpdate={handleSubjectUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectDetails; 