const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
    trim: true
  },
  subjectCode: {
    type: String,
    required: true,
    trim: true
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  regulation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    default: 'N/A',
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  // Create a helper function to generate section schema
  academicCalendar: {
    description: { type: String, default: 'Upload the official academic calendar showing important dates, semester schedules, examination periods, and academic milestones for the current academic year.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  testSchedules: {
    description: { type: String, default: 'Provide detailed schedules for all internal assessments, unit tests, mid-term examinations, and other evaluation activities planned for this subject.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  listOfHolidays: {
    description: { type: String, default: 'Include the official list of holidays, festival breaks, and non-working days that may affect the class schedule and academic activities.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  subjectAllocation: {
    description: { type: String, default: 'Document the subject allocation details including faculty assignment, class sections, and teaching load distribution for this course.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  individualClassTimeTable: {
    description: { type: String, default: 'Upload the specific timetable for this subject showing class timings, room allocations, and weekly schedule for lectures, tutorials, and practicals.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  listOfRegisteredStudents: {
    description: { type: String, default: 'Maintain an updated list of all students registered for this subject including their roll numbers, names, and contact information.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  courseSyllabus: {
    description: { type: String, default: 'Provide the complete course syllabus with unit-wise topics, prescribed textbooks, reference materials, and recommended reading list.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  lessonPlan: {
    description: { type: String, default: 'Create detailed lesson plans covering all syllabus topics, additional enrichment topics beyond syllabus, tutorial sessions, and practical activities.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  unitWiseHandOuts: {
    description: { type: String, default: 'Prepare and upload unit-wise handouts, study materials, quick reference guides, and supplementary notes for student distribution.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  unitWiseLectureNotes: {
    description: { type: String, default: 'Upload comprehensive lecture notes organized by units covering all topics taught in class with detailed explanations and examples.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  contentOfTopicsBeyondSyllabus: {
    description: { type: String, default: 'Document additional topics, advanced concepts, and enrichment materials taught beyond the prescribed syllabus to enhance student learning.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  tutorialScripts: {
    description: { type: String, default: 'Provide tutorial scripts, problem-solving sessions, practical exercises, and step-by-step solutions for better understanding of concepts.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  questionBank: {
    description: { type: String, default: 'Maintain a comprehensive question bank with various types of questions including objective, short answer, and long answer questions for practice.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  previousQuestionPapers: {
    description: { type: String, default: 'Archive previous years question papers for student reference and exam preparation with solutions where available.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  sampleQuestionPapers: {
    description: { type: String, default: 'Provide sample question papers following the current exam pattern to help students understand the format and difficulty level.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  modelQuestionPapers: {
    description: { type: String, default: 'Upload model question papers with detailed solutions and marking schemes for comprehensive exam preparation.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  assignmentQuestions: {
    description: { type: String, default: 'Compile assignment questions, project topics, and coursework materials for continuous assessment and skill development.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  internalAssessmentQuestionPapers: {
    description: { type: String, default: 'Archive internal assessment question papers, test papers, and evaluation materials used during the semester.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  studentAttendance: {
    description: { type: String, default: 'Maintain detailed attendance records for all students including dates, topics covered, and attendance percentage calculations.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  internalMarks: {
    description: { type: String, default: 'Record and maintain internal assessment marks, test scores, assignment grades, and continuous evaluation results.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  remedialClasses: {
    description: { type: String, default: 'Document remedial classes conducted for slow learners including topics covered, attendance, and improvement strategies.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  slowLearnersList: {
    description: { type: String, default: 'Maintain a list of slow learners with their specific learning challenges and individualized support plans.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  advancedLearnersList: {
    description: { type: String, default: 'Identify and document advanced learners with their achievements and additional enrichment activities provided.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  industryExpertLectures: {
    description: { type: String, default: 'Document industry expert lectures, guest sessions, and professional interactions organized for practical exposure.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  coPoMapping: {
    description: { type: String, default: 'Upload Course Outcome to Program Outcome mapping documents showing alignment with program objectives.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  coAttainment: {
    description: { type: String, default: 'Document Course Outcome attainment analysis with assessment results and achievement levels.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  poAttainment: {
    description: { type: String, default: 'Provide Program Outcome attainment analysis showing how course contributes to overall program goals.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  courseExitSurvey: {
    description: { type: String, default: 'Upload course exit survey results and analysis showing student satisfaction and course effectiveness.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  studentFeedback: {
    description: { type: String, default: 'Compile student feedback on teaching methods, course content, and suggestions for improvement.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  peerReview: {
    description: { type: String, default: 'Document peer review feedback from colleagues on teaching methods, course delivery, and professional development.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  selfAppraisal: {
    description: { type: String, default: 'Upload self-appraisal documents including teaching reflection, achievements, and professional development goals.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  timetable: {
    description: { type: String, default: 'Upload your class timetable here. Include class timings, room numbers, and schedule details.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  lessonplan: {
    description: { type: String, default: 'Upload your lesson plan here. Include topics, objectives, teaching methods, and assessment strategies.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  midsheets: {
    description: { type: String, default: 'Upload your mid-semester sheets here. Include question papers, answer keys, and evaluation criteria.' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', subjectSchema); 