import React, { useState } from 'react';
import axios from 'axios';

const SubjectSections = ({ subject, onUpdate }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setSectionData({ description: '', file: null });
    setError('');
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
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word documents are allowed!');
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB!');
        return;
      }

      setSectionData({
        ...sectionData,
        file: file
      });
      setError('');
    }
  };

  const handleSaveSection = async () => {
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('description', sectionData.description);
      if (sectionData.file) {
        formData.append('file', sectionData.file);
      }

      const response = await axios.put(
        `/api/subjects/${subject._id}/section/${editingSection}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onUpdate(response.data);
      setEditingSection(null);
      setSectionData({ description: '', file: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update section');
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
      const response = await axios.get(
        `/api/subjects/${subject._id}/download-merged-pdf`,
        {
          responseType: 'blob'
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${subject.subjectName}_${subject.subjectId}_merged.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download merged PDF');
    } finally {
      setLoading(false);
    }
  };

  // Check if there are any files to download
  const hasFilesToDownload = sections.some(section => 
    subject[section.name]?.fileName && subject[section.name].fileName.trim() !== ''
  );

  return (
    <div className="subject-sections">
      <div className="sections-header">
        <h3>Subject Sections</h3>
        {hasFilesToDownload && (
          <button
            className="btn btn-primary download-btn"
            onClick={handleDownloadMergedPdf}
            disabled={loading}
          >
            {loading ? 'Downloading...' : '📥 Download Merged PDF'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} className="close-btn">&times;</button>
        </div>
      )}

      <div className="sections-grid">
        {sections.map((section) => (
          <div key={section.name} className="section-card">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">{section.icon}</span>
                <h4>{section.title}</h4>
              </div>
              {editingSection !== section.name && (
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleEditSection(section)}
                >
                  Edit
                </button>
              )}
            </div>

            {editingSection === section.name ? (
              <div className="section-edit-form">
                <div className="form-group">
                  <label>Upload File (PDF or Word)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <small>Maximum file size: 10MB</small>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveSection}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                <div className="section-description">
                  <p>{subject[section.name]?.description || section.defaultDescription}</p>
                </div>

                {subject[section.name]?.fileName ? (
                  <div className="section-file">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{subject[section.name].fileName}</span>
                      <span className="file-date">
                        Uploaded: {formatDate(subject[section.name].uploadedAt)}
                      </span>
                    </div>
                    <div className="file-actions">
                      <a
                        href={`http://localhost:5000${subject[section.name].fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-small btn-primary"
                      >
                        View
                      </a>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteFile(section.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-file">
                    <p>No file uploaded</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSections; 