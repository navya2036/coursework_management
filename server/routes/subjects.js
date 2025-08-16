const express = require('express');
const auth = require('../middleware/auth');
const { upload, createHierarchicalPath } = require('../middleware/upload');
const Subject = require('../models/Subject');
const fs = require('fs');
const path = require('path');
const PDFMerger = require('pdf-merger-js');
const mammoth = require('mammoth');
const { jsPDF } = require('jspdf');
const { handlePdfUploadWithCover } = require('../utils/pdfUtils');

const router = express.Router();

// Helper function to get the hierarchical file path
function getHierarchicalFilePath(subject, teacher, fileName) {
  const hierarchicalPath = createHierarchicalPath(
    subject.academicYear, 
    teacher.department, 
    teacher.facultyId, 
    subject._id.toString()
  );
  return path.join(hierarchicalPath, fileName);
}

// Helper function to get the file URL with hierarchical structure
function getHierarchicalFileUrl(subject, teacher, fileName) {
  return `/uploads/${subject.academicYear}/${teacher.department}/${teacher.facultyId}/${subject._id}/${fileName}`;
}

// @route   GET /api/subjects
// @desc    Get all subjects for a teacher (optionally filtered by academic year)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { academicYear } = req.query;
    let query = { teacher: req.teacher._id };
    
    // If academic year is provided, filter by it
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    const subjects = await Subject.find(query).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get a single subject by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Get subject by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subjects
// @desc    Add a new subject
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { academicYear, year, semester, subjectCode, subjectName, regulation, department, class: className } = req.body;

    // Check if all required fields are provided
    if (!academicYear || !year || !semester || !subjectCode || !subjectName || !regulation || !department || !className) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if subject code already exists for this teacher in the same academic year
    const existingSubject = await Subject.findOne({ 
      teacher: req.teacher._id, 
      subjectCode: subjectCode,
      academicYear: academicYear
    });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this code already exists for this academic year' });
    }

    const newSubject = new Subject({
      teacher: req.teacher._id,
      academicYear,
      year,
      semester,
      subjectCode,
      subjectName,
      regulation,
      department,
      class: className
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error('Add subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update a subject
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { academicYear, year, semester, subjectCode, subjectName, regulation, department, class: className } = req.body;

    // Check if all required fields are provided
    if (!academicYear || !year || !semester || !subjectCode || !subjectName || !regulation || !department || !className) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if subject code already exists for this teacher in the same academic year (excluding current subject)
    const existingSubject = await Subject.findOne({ 
      teacher: req.teacher._id, 
      subjectCode: subjectCode,
      academicYear: academicYear,
      _id: { $ne: req.params.id }
    });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this code already exists for this academic year' });
    }

    subject.academicYear = academicYear;
    subject.year = year;
    subject.semester = semester;
    subject.subjectCode = subjectCode;
    subject.subjectName = subjectName;
    subject.regulation = regulation;
    subject.department = department;
    subject.class = className;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Delete associated files from ALL sections (scan entire subject document)
    console.log('Deleting subject files for:', subject.subjectName);
    
    // Get all keys from the subject document to find sections with files
    const allSubjectKeys = Object.keys(subject.toObject());
    let filesDeleted = 0;
    
    for (const key of allSubjectKeys) {
      const sectionData = subject[key];
      if (sectionData && typeof sectionData === 'object' && sectionData.fileName && sectionData.fileName.trim() !== '') {
        const filePath = getHierarchicalFilePath(subject, req.teacher, sectionData.fileName);
        console.log(`Attempting to delete file: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            filesDeleted++;
            console.log(`Successfully deleted file: ${sectionData.fileName}`);
          } catch (error) {
            console.error(`Error deleting file ${sectionData.fileName}:`, error);
          }
        } else {
          console.log(`File not found: ${filePath}`);
        }
      }
    }
    
    console.log(`Total files deleted: ${filesDeleted}`);
    
    // Try to remove the subject folder if it's empty
    try {
      const subjectFolderPath = createHierarchicalPath(
        subject.academicYear, 
        req.teacher.department, 
        req.teacher.facultyId, 
        subject._id.toString()
      );
      if (fs.existsSync(subjectFolderPath)) {
        const files = fs.readdirSync(subjectFolderPath);
        if (files.length === 0) {
          fs.rmdirSync(subjectFolderPath);
        }
      }
    } catch (error) {
      console.log('Could not remove empty folder:', error.message);
    }

    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/subjects/:id/section/:sectionName
// @desc    Update section description and upload file
// @access  Private
router.put('/:id/section/:sectionName', auth, upload.single('file'), async (req, res) => {
  try {
    const { sectionName } = req.params;
    const { description } = req.body;

    // Validate section name
    const validSections = [
      'academicCalendar', 'testSchedules', 'listOfHolidays', 'subjectAllocation',
      'individualClassTimeTable', 'listOfRegisteredStudents', 'courseSyllabus',
      'lessonPlan', 'unitWiseHandOuts', 'unitWiseLectureNotes', 'contentOfTopicsBeyondSyllabus',
      'tutorialScripts', 'questionBank', 'previousQuestionPapers', 'sampleQuestionPapers',
      'modelQuestionPapers', 'assignmentQuestions', 'internalAssessmentQuestionPapers',
      'studentAttendance', 'internalMarks', 'remedialClasses', 'slowLearnersList',
      'advancedLearnersList', 'industryExpertLectures', 'coPoMapping', 'coAttainment',
      'poAttainment', 'courseExitSurvey', 'studentFeedback', 'peerReview',
      'selfAppraisal', 'timetable', 'lessonplan', 'midsheets'
    ];
    if (!validSections.includes(sectionName)) {
      return res.status(400).json({ message: 'Invalid section name' });
    }

    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Update description if provided
    if (description !== undefined) {
      subject[sectionName].description = description;
    }

    // Handle file upload if file is provided
    if (req.file) {
      // Delete old file if exists
      if (subject[sectionName].fileName) {
        const oldFilePath = getHierarchicalFilePath(subject, req.teacher, subject[sectionName].fileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Handle file upload with cover page
      const fileInfo = await handlePdfUploadWithCover(
        req.file, 
        sectionName, 
        subject, 
        req.teacher
      );
      
      // Update file information with new hierarchical structure
      subject[sectionName].fileName = fileInfo.fileName;
      subject[sectionName].fileUrl = fileInfo.fileUrl;
      subject[sectionName].uploadedAt = fileInfo.uploadedAt;
    }

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/subjects/:id/section/:sectionName/file
// @desc    Delete file from a section
// @access  Private
router.delete('/:id/section/:sectionName/file', auth, async (req, res) => {
  try {
    const { sectionName } = req.params;

    // Validate section name
    const validSections = [
      'academicCalendar', 'testSchedules', 'listOfHolidays', 'subjectAllocation',
      'individualClassTimeTable', 'listOfRegisteredStudents', 'courseSyllabus',
      'lessonPlan', 'unitWiseHandOuts', 'unitWiseLectureNotes', 'contentOfTopicsBeyondSyllabus',
      'tutorialScripts', 'questionBank', 'previousQuestionPapers', 'sampleQuestionPapers',
      'modelQuestionPapers', 'assignmentQuestions', 'internalAssessmentQuestionPapers',
      'studentAttendance', 'internalMarks', 'remedialClasses', 'slowLearnersList',
      'advancedLearnersList', 'industryExpertLectures', 'coPoMapping', 'coAttainment',
      'poAttainment', 'courseExitSurvey', 'studentFeedback', 'peerReview',
      'selfAppraisal', 'timetable', 'lessonplan', 'midsheets'
    ];
    if (!validSections.includes(sectionName)) {
      return res.status(400).json({ message: 'Invalid section name' });
    }

    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Delete file if exists
    if (subject[sectionName].fileName) {
      const filePath = getHierarchicalFilePath(subject, req.teacher, subject[sectionName].fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Clear file information
      subject[sectionName].fileName = '';
      subject[sectionName].fileUrl = '';
      subject[sectionName].uploadedAt = null;
    }

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subjects/:id/download-merged-pdf
// @desc    Download all section files merged into a single PDF
// @access  Private
router.get('/:id/download-merged-pdf', auth, async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      teacher: req.teacher._id 
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Updated sections to match exactly with the frontend SubjectSections component
    const sections = [
      { name: 'academicCalendar', title: 'Academic Calendar' },
      { name: 'testSchedules', title: 'Test Schedules' },
      { name: 'listOfHolidays', title: 'List of Holidays' },
      { name: 'subjectAllocation', title: 'Subject Allocation' },
      { name: 'individualClassTimeTable', title: 'Individual Class Time Table' },
      { name: 'listOfRegisteredStudents', title: 'List of Registered Students' },
      { name: 'courseSyllabus', title: 'Course Syllabus along with Text Books and References' },
      { name: 'lessonPlan', title: 'Lesson Plan including Topics Planned Beyond Syllabus and Tutorials' },
      { name: 'unitWiseHandOuts', title: 'Unit Wise Hand-outs' },
      { name: 'unitWiseLectureNotes', title: 'Unit-Wise Lecture Notes' },
      { name: 'contentOfTopicsBeyondSyllabus', title: 'Content of Topics Beyond the Syllabus' },
      { name: 'tutorialScripts', title: 'Tutorial Scripts' },
      { name: 'questionBank', title: 'Question Bank' },
      { name: 'previousQuestionPapers', title: 'Previous Question papers of Sem End Examination' },
      { name: 'internalEvaluation1', title: 'Internal Evaluation 1' },
      { name: 'internalEvaluation2', title: 'Internal Evaluation 2' },
      { name: 'overallInternalEvaluationMarks', title: 'Overall Internal Evaluation Marks' },
      { name: 'semesterEndExaminationQuestionPaper', title: 'Semester End Examination Question Paper' },
      { name: 'resultAnalysis', title: 'Result Analysis' },
      { name: 'innovativeMethodsEmployed', title: 'Innovative Methods Employed in Teaching learning Process' },
      { name: 'recordOfAttendanceAndAssessment', title: 'Record of Attendance and Assessment' },
      { name: 'studentFeedbackReport', title: 'Student Feedback Report' },
      { name: 'recordOfAttainmentOfCourseOutcomes', title: 'Record of Attainment of Course Outcomes' }
    ];

    // Check if there are any files to merge
    const sectionsWithFiles = sections.filter(section => 
      subject[section.name] && subject[section.name].fileName && subject[section.name].fileName.trim() !== ''
    );

    console.log('Sections with files found:', sectionsWithFiles.length);
    console.log('Files to merge:', sectionsWithFiles.map(section => ({
      section: section.name,
      fileName: subject[section.name].fileName,
      uploadedAt: subject[section.name].uploadedAt
    })));

    if (sectionsWithFiles.length === 0) {
      return res.status(400).json({ message: 'No files found to merge' });
    }

    const merger = new PDFMerger();
    const tempDir = path.join(__dirname, '..', 'temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Helper function to convert Word document to PDF
    const convertWordToPdf = async (wordFilePath, outputPdfPath) => {
      try {
        const result = await mammoth.extractRawText({ path: wordFilePath });
        const doc = new jsPDF();
        
        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(result.value, 180);
        
        // Add text to PDF with page breaks
        let y = 20;
        const lineHeight = 10;
        const pageHeight = 280;
        
        for (let i = 0; i < lines.length; i++) {
          if (y > pageHeight) {
            doc.addPage();
            y = 20;
          }
          doc.text(lines[i], 10, y);
          y += lineHeight;
        }
        
        doc.save(outputPdfPath);
        return true;
      } catch (error) {
        console.error('Error converting Word to PDF:', error);
        return false;
      }
    };

    // Process each section file in order
    let filesAdded = 0;
    for (const section of sectionsWithFiles) {
      const fileName = subject[section.name].fileName;
      const filePath = getHierarchicalFilePath(subject, req.teacher, fileName);
      
      console.log(`Processing section: ${section.name}, file: ${fileName}`);
      console.log(`File path: ${filePath}`);
      console.log(`File exists: ${fs.existsSync(filePath)}`);
      
      if (fs.existsSync(filePath)) {
        const fileExt = path.extname(fileName).toLowerCase();
        console.log(`File extension: ${fileExt}`);
        
        try {
          if (fileExt === '.pdf') {
            // Add PDF directly
            await merger.add(filePath);
            filesAdded++;
            console.log(`Successfully added PDF: ${fileName}`);
          } else if (fileExt === '.doc' || fileExt === '.docx') {
            // Convert Word document to PDF first
            const tempPdfPath = path.join(tempDir, `${section.name}_${Date.now()}.pdf`);
            console.log(`Converting Word document to PDF: ${fileName}`);
            const converted = await convertWordToPdf(filePath, tempPdfPath);
            
            if (converted && fs.existsSync(tempPdfPath)) {
              await merger.add(tempPdfPath);
              filesAdded++;
              console.log(`Successfully converted and added Word document: ${fileName}`);
              // Clean up temp file after adding to merger
              setTimeout(() => {
                if (fs.existsSync(tempPdfPath)) {
                  fs.unlinkSync(tempPdfPath);
                }
              }, 1000);
            } else {
              console.error(`Failed to convert Word document: ${fileName}`);
            }
          } else {
            console.log(`Unsupported file type: ${fileExt} for file: ${fileName}`);
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
        }
      } else {
        console.error(`File not found: ${filePath}`);
      }
    }
    
    console.log(`Total files added to merger: ${filesAdded}`);
    
    if (filesAdded === 0) {
      return res.status(400).json({ message: 'No valid PDF files could be processed for merging' });
    }

    // Generate the merged PDF
    const outputFileName = `${subject.subjectName}_${subject.subjectCode}_merged_${Date.now()}.pdf`;
    const outputPath = path.join(tempDir, outputFileName);
    
    await merger.save(outputPath);

    // Send the file for download
    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      
      // Clean up the temporary file after download
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 5000);
    });

  } catch (error) {
    console.error('Merge PDF error:', error);
    res.status(500).json({ message: 'Error merging files' });
  }
});

module.exports = router; 