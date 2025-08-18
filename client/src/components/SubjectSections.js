import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectSections = ({ subject, onUpdate }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // Always use list view
  const viewMode = 'list';
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');

  const sections = [
    {
      name: 'academicCalendar',
      title: 'Academic Calendar',
      icon: '📅',
      defaultDescription: 'Upload the official academic calendar showing important dates, semester schedules, examination periods, and academic milestones for the current academic year.'
    },
    {
      name: 'testSchedules',
      title: 'Test Schedules',
      icon: '📋',
      defaultDescription: 'Provide detailed schedules for all internal assessments, unit tests, mid-term examinations, and other evaluation activities planned for this subject.'
    },
    {
      name: 'listOfHolidays',
      title: 'List of Holidays',
      icon: '🏖️',
      defaultDescription: 'Include the official list of holidays, festival breaks, and non-working days that may affect the class schedule and academic activities.'
    },
    {
      name: 'subjectAllocation',
      title: 'Subject Allocation',
      icon: '📊',
      defaultDescription: 'Document the subject allocation details including faculty assignment, class sections, and teaching load distribution for this course.'
    },
    {
      name: 'individualClassTimeTable',
      title: 'Individual Class Time Table',
      icon: '⏰',
      defaultDescription: 'Upload the specific timetable for this subject showing class timings, room allocations, and weekly schedule for lectures, tutorials, and practicals.'
    },
    {
      name: 'listOfRegisteredStudents',
      title: 'List of Registered Students',
      icon: '👥',
      defaultDescription: 'Maintain an updated list of all students registered for this subject including their roll numbers, names, and contact information.'
    },
    {
      name: 'courseSyllabus',
      title: 'Course Syllabus along with Text Books and References',
      icon: '📚',
      defaultDescription: 'Provide the complete course syllabus with unit-wise topics, prescribed textbooks, reference materials, and recommended reading list.'
    },
    {
      name: 'lessonPlan',
      title: 'Lesson Plan including Topics Planned Beyond Syllabus and Tutorials',
      icon: '📖',
      defaultDescription: 'Create detailed lesson plans covering all syllabus topics, additional enrichment topics beyond syllabus, tutorial sessions, and practical activities.'
    },
    {
      name: 'unitWiseHandOuts',
      title: 'Unit Wise Hand-outs',
      icon: '📋',
      defaultDescription: 'Prepare and upload unit-wise handouts, study materials, quick reference guides, and supplementary notes for student distribution.'
    },
    {
      name: 'unitWiseLectureNotes',
      title: 'Unit-Wise Lecture Notes',
      icon: '📝',
      defaultDescription: 'Upload comprehensive lecture notes organized by units covering all topics taught in class with detailed explanations and examples.'
    },
    {
      name: 'contentOfTopicsBeyondSyllabus',
      title: 'Content of Topics Beyond the Syllabus',
      icon: '📄',
      defaultDescription: 'Document additional topics, advanced concepts, and enrichment materials taught beyond the prescribed syllabus to enhance student learning.'
    },
    {
      name: 'tutorialScripts',
      title: 'Tutorial Scripts',
      icon: '📜',
      defaultDescription: 'Provide tutorial scripts, problem-solving sessions, practical exercises, and step-by-step solutions for better understanding of concepts.'
    },
    {
      name: 'questionBank',
      title: 'Question Bank',
      icon: '❓',
      defaultDescription: 'Maintain a comprehensive question bank with various types of questions including objective, short answer, and long answer questions for practice.'
    },
    {
      name: 'previousQuestionPapers',
      title: 'Previous Question papers of Sem End Examination',
      icon: '📋',
      defaultDescription: 'Archive previous semester end examination question papers to help students understand exam patterns and prepare effectively.'
    },
    {
      name: 'internalEvaluation1',
      title: 'Internal Evaluation 1',
      icon: '📊',
      defaultDescription: 'i. Descriptive Question Paper\n\nii. Quiz Question Paper\n\niii. Assignment Question Paper\n\niv. Scheme of Evaluation of Descriptive Question\n\nv. Sample Answer scripts of Descriptive, Quiz and Assignment\n\nvi. Consolidated marks of Internal Evaluations 1'
    },
    {
      name: 'internalEvaluation2',
      title: 'Internal Evaluation 2',
      icon: '📈',
      defaultDescription: 'i. Descriptive Question Paper\n\nii. Quiz Question Paper\n\niii. Assignment Question Paper\n\niv. Scheme of Evaluation of Descriptive Question\n\nv. Sample Answer scripts of Descriptive, Quiz and Assignment\n\nvi. Consolidated marks of Internal Evaluations 2'
    },
    {
      name: 'overallInternalEvaluationMarks',
      title: 'Overall Internal Evaluation Marks',
      icon: '🎯',
      defaultDescription: 'Compile consolidated internal evaluation marks combining all assessments with statistical analysis and grade distribution.'
    },
    {
      name: 'semesterEndExaminationQuestionPaper',
      title: 'Semester End Examination Question Paper',
      icon: '📑',
      defaultDescription: 'Upload the final semester end examination question paper with marking scheme and model answers for reference.'
    },
    {
      name: 'resultAnalysis',
      title: 'Result Analysis',
      icon: '📊',
      defaultDescription: 'Provide detailed analysis of examination results including pass percentage, grade distribution, and performance trends with recommendations.'
    },
    {
      name: 'innovativeMethodsEmployed',
      title: 'Innovative Methods Employed in Teaching learning Process',
      icon: '💡',
      defaultDescription: 'Document innovative teaching methodologies, technology integration, interactive sessions, and creative approaches used to enhance learning.'
    },
    {
      name: 'recordOfAttendanceAndAssessment',
      title: 'Record of Attendance and Assessment',
      icon: '📋',
      defaultDescription: 'Maintain detailed records of student attendance, continuous assessment marks, assignment submissions, and participation in class activities.'
    },
    {
      name: 'studentFeedbackReport',
      title: 'Student Feedback Report',
      icon: '💬',
      defaultDescription: 'Compile student feedback reports including course evaluation, teaching effectiveness, suggestions for improvement, and action taken.'
    },
    {
      name: 'recordOfAttainmentOfCourseOutcomes',
      title: 'Record of Attainment of Course Outcomes',
      icon: '🎓',
      defaultDescription: 'Document the attainment of course outcomes with evidence, assessment mapping, and analysis of learning objectives achievement.'
    }
  ];

  const handleEditSection = (section) => {
    setEditingSection(section.name);
    setSectionData({
      description: subject[section.name]?.description || '',
      file: null
    });
    setError('');
    setUploadProgress(0);
    
    // Ensure the section is expanded when editing
    const newExpanded = new Set(expandedSections);
    newExpanded.add(section.name);
    setExpandedSections(newExpanded);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setSectionData({ description: '', file: null });
    setError('');
    setUploadProgress(0);
    
    // Clear any file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  const handleInputChange = (e) => {
    setSectionData({
      ...sectionData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only allow PDF files
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed!');
        e.target.value = ''; // Clear the input
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB!');
        e.target.value = ''; // Clear the input
        return;
      }

      setSectionData({
        ...sectionData,
        file: file
      });
      setError('');
      console.log('File selected:', file.name, file.type, file.size);
    }
  };

  const handleSaveSection = async () => {
    if (!sectionData.file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('description', sectionData.description);
      formData.append('file', sectionData.file);
      formData.append('sectionName', editingSection);

      console.log('Uploading file:', sectionData.file.name, 'for section:', editingSection);

      const response = await axios.put(
        `/api/subjects/${subject._id}/section/${editingSection}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      console.log('Upload successful:', response.data);
      onUpdate(response.data);
      setEditingSection(null);
      setSectionData({ description: '', file: null });
      setUploadProgress(0);
      
      // Clear the file input
      const fileInput = document.getElementById(`file-${editingSection}`);
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (sectionName) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await axios.delete(
          `/api/subjects/${subject._id}/section/${sectionName}/file`
        );
        onUpdate(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete file');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownloadMergedPdf = async () => {
    setLoading(true);
    setError('');

    try {
      // Log all files that should be included in the merge
      const sectionsWithFiles = sections.filter(section => {
        const sectionData = subject[section.name];
        return sectionData && sectionData.fileName && sectionData.fileName.trim() !== '';
      });
      
      console.log('Attempting to download merged PDF with files from sections:', 
        sectionsWithFiles.map(section => ({
          section: section.name,
          fileName: subject[section.name].fileName,
          uploadedAt: subject[section.name].uploadedAt
        }))
      );
      
      if (sectionsWithFiles.length === 0) {
        setError('No files found to merge. Please upload some files first.');
        return;
      }

      const response = await axios.get(
        `/api/subjects/${subject._id}/download-merged-pdf`,
        {
          responseType: 'blob',
          timeout: 60000 // 60 second timeout for large files
        }
      );

      console.log('Download response received, size:', response.data.size);

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${subject.subjectName || 'Subject'}_${subject.subjectCode || 'Code'}_merged.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      console.log('Downloading file:', filename);
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Download initiated successfully');
    } catch (err) {
      console.error('Download error:', err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'No files found to merge');
      } else if (err.code === 'ECONNABORTED') {
        setError('Download timeout. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to download merged PDF. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if there are any files to download - improved logic
  const hasFilesToDownload = sections.some(section => {
    const sectionData = subject[section.name];
    const hasFile = sectionData && sectionData.fileName && sectionData.fileName.trim() !== '';
    if (hasFile) {
      console.log(`Found file for ${section.name}:`, sectionData.fileName);
    }
    return hasFile;
  });
  
  // Debug: Log all sections with files
  console.log('Sections with files:', sections.filter(section => {
    const sectionData = subject[section.name];
    return sectionData && sectionData.fileName && sectionData.fileName.trim() !== '';
  }).map(section => ({ name: section.name, fileName: subject[section.name].fileName })));
  
  console.log('hasFilesToDownload:', hasFilesToDownload);

  // Filter sections based on search term and status
  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.defaultDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'uploaded') {
      return subject[section.name]?.fileName;
    } else if (filterStatus === 'pending') {
      return !subject[section.name]?.fileName;
    }
    return true;
  });

  // Toggle section expansion
  const toggleSectionExpansion = (sectionName) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  // Get upload statistics
  const getUploadStats = () => {
    const total = sections.length;
    const uploaded = sections.filter(section => subject[section.name]?.fileName).length;
    const pending = total - uploaded;
    return { total, uploaded, pending, percentage: Math.round((uploaded / total) * 100) };
  };

  const stats = getUploadStats();

  return (
    <div className="subject-sections-modern">
      {/* Simple Header with Download Button */}
      <div className="simple-header">
        <div className="header-title">
          <h3>Subject Sections</h3>
        </div>
        <div className="header-actions">
          {hasFilesToDownload && (
            <button
              className="btn-modern btn-primary-modern"
              onClick={handleDownloadMergedPdf}
              disabled={loading}
            >
              <span className="btn-icon">📥</span>
              {loading ? 'Downloading...' : 'Download Merged PDF'}
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="controls-section">
        <div className="search-filter-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sections ({sections.length})</option>
              <option value="uploaded">Uploaded ({stats.uploaded})</option>
              <option value="pending">Pending ({stats.pending})</option>
            </select>
          </div>
        </div>
        {/* Removed view-controls */}
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="alert-modern alert-error">
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{error}</span>
          <button onClick={() => setError('')} className="alert-close">&times;</button>
        </div>
      )}

      {/* Enhanced Sections Grid */}
      <div className={`sections-container ${viewMode}`}>
        {filteredSections.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No sections found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`sections-grid-modern ${viewMode}-view`}>
            {filteredSections.map((section, index) => {
              const hasFile = subject[section.name]?.fileName;
              const isExpanded = expandedSections.has(section.name);
              
              return (
                <div 
                  key={section.name} 
                  className={`section-card-modern ${
                    hasFile ? 'has-file' : 'no-file'
                  } ${editingSection === section.name ? 'editing' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="card-header-modern">
                    <div className="card-title-section">
                      <div className="section-number">{index + 1}</div>
                      <div className="section-icon-modern">{section.icon}</div>
                      <div className="section-title-content">
                        <h4 className="section-title-modern">{section.title}</h4>
                        <div className="section-status">
                          {hasFile ? (
                            <span className="status-badge uploaded">✓ Uploaded</span>
                          ) : (
                            <span className="status-badge pending">⏳ Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <button
                        className="expand-btn"
                        onClick={() => toggleSectionExpansion(section.name)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div className={`card-content-modern ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {editingSection === section.name ? (
                      <div className="section-edit-form-modern">
                        <div className="upload-area">
                          <div className="upload-dropzone">
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileChange}
                              className="file-input-hidden"
                              id={`file-${section.name}`}
                            />
                            <label htmlFor={`file-${section.name}`} className="upload-label">
                              <div className="upload-icon">📁</div>
                              <div className="upload-text">
                                <strong>Choose PDF file or drag and drop</strong>
                                <span>Only PDF files are accepted</span>
                                <span className="file-size-limit">Maximum file size: 10MB</span>
                              </div>
                            </label>
                          </div>
                          
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="upload-progress">
                              <div className="progress-bar-upload">
                                <div 
                                  className="progress-fill-upload" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <span className="progress-text">{uploadProgress}%</span>
                            </div>
                          )}
                        </div>

                        <div className="form-actions-modern">
                          <button
                            className="btn-modern btn-primary-modern"
                            onClick={handleSaveSection}
                            disabled={loading || !sectionData.file}
                          >
                            {loading ? (
                              <>
                                <span className="spinner"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <span className="btn-icon">💾</span>
                                Save Changes
                              </>
                            )}
                          </button>
                          <button
                            className="btn-modern btn-secondary-modern"
                            onClick={handleCancelEdit}
                            disabled={loading}
                          >
                            <span className="btn-icon">✕</span>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="section-content-modern">
                        <div className="section-description-modern">
                          <p>{subject[section.name]?.description || section.defaultDescription}</p>
                        </div>

                        {hasFile ? (
                          <div className="file-display-modern">
                            <div className="file-card">
                              <div className="file-info-modern">
                                <div className="file-icon-large">📄</div>
                                <div className="file-details">
                                  <div className="file-name-modern">
                                    {subject[section.name].fileName}
                                  </div>
                                  <div className="file-meta">
                                    <span className="file-date">
                                      📅 {formatDate(subject[section.name].uploadedAt)}
                                    </span>
                                    <span className="file-size">
                                      📊 {subject[section.name].fileSize || 'Unknown size'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="file-actions-modern">
                                <a
                                  href={`http://localhost:5000${subject[section.name].fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-modern btn-view"
                                  title="View File"
                                >
                                  <span className="btn-icon">👁️</span>
                                  View
                                </a>
                                <button
                                  className="btn-modern btn-danger-modern"
                                  onClick={() => handleDeleteFile(section.name)}
                                  title="Delete File"
                                >
                                  <span className="btn-icon">🗑️</span>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="no-file-modern">
                            <div className="no-file-icon">📂</div>
                            <p className="no-file-text">No file uploaded yet</p>
                            <p className="no-file-hint">Click "Upload File" to add your document</p>
                          </div>
                        )}
                        
                        <div className="section-actions-modern">
                          <button
                            className="btn-modern btn-edit"
                            onClick={() => handleEditSection(section)}
                          >
                            <span className="btn-icon">{hasFile ? '📝' : '📤'}</span>
                            {hasFile ? 'Edit' : 'Upload File'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSections; 