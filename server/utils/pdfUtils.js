const { jsPDF } = require('jspdf');
const PDFMerger = require('pdf-merger-js');
const fs = require('fs').promises;
const path = require('path');
const mammoth = require('mammoth');

/**
 * Creates a PDF cover page with centered text
 * @param {string} text - The text to display
 * @param {number} fontSize - Font size (default: 28)
 * @param {boolean} isSubjectPage - Whether this is a subject page (for styling)
 * @returns {Promise<Buffer>} - PDF buffer of the cover page
 */
async function createCoverPage(text, fontSize = 28, isSubjectPage = false) {
  return new Promise((resolve) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add background color
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Set font based on page type
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize);
      
      // Format text - convert camelCase to space-separated words
      const formattedText = text
        .split(/(?=[A-Z])/)
        .join(' ')
        .toUpperCase();
      
      // Calculate text width and position for centering
      const textWidth = doc.getTextWidth(formattedText);
      const textX = (pageWidth - textWidth) / 2;
      const textY = pageHeight / 2;
      
      // Add the text
      doc.setTextColor(0, 0, 0);
      doc.text(formattedText, textX, textY);
      
      // Add a subtle line under the text
      doc.setDrawColor(200, 200, 200);
      doc.line(textX, textY + 5, textX + textWidth, textY + 5);
      
      // For subject page, add a subtitle
      if (isSubjectPage) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        const subtitle = 'Course Materials';
        const subtitleWidth = doc.getTextWidth(subtitle);
        doc.text(subtitle, (pageWidth - subtitleWidth) / 2, textY + 30);
      }
      
      // Get PDF as buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      resolve(pdfBuffer);
    } catch (error) {
      console.error('Error creating cover page:', error);
      // Return empty buffer if there's an error
      resolve(Buffer.alloc(0));
    }
  });
}

/**
 * Merges cover pages with an existing PDF file
 * @param {string} originalPdfPath - Path to the original PDF file
 * @param {string} sectionName - Name of the section
 * @param {string} subjectName - Name of the subject
 * @param {boolean} isFirstSection - Whether this is the first section being uploaded
 * @returns {Promise<string>} - Path to the merged PDF file
 */
async function mergePdfWithCover(originalPdfPath, sectionName, subjectName, isFirstSection = false) {
  try {
    const merger = new PDFMerger();
    const tempDir = path.dirname(originalPdfPath);
    const tempMergedPath = path.join(tempDir, `merged-${Date.now()}.pdf`);
    
    // Create temporary files
    const tempFiles = [];
    const createTempFile = async (content) => {
      const tempPath = path.join(tempDir, `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
      await fs.writeFile(tempPath, content);
      tempFiles.push(tempPath);
      return tempPath;
    };
    
    try {
      // For first section, add subject cover page
      if (isFirstSection && subjectName) {
        const subjectCoverBuffer = await createCoverPage(subjectName, 36, true);
        const subjectCoverPath = await createTempFile(subjectCoverBuffer);
        await merger.add(subjectCoverPath);
      }
      
      // Add section cover page
      const sectionCoverBuffer = await createCoverPage(sectionName);
      const sectionCoverPath = await createTempFile(sectionCoverBuffer);
      await merger.add(sectionCoverPath);
      
      // Add the original PDF
      await merger.add(originalPdfPath);
      
      // Save merged PDF
      await merger.save(tempMergedPath);
      
      // Replace original with merged file
      await fs.rename(tempMergedPath, originalPdfPath);
      
      return originalPdfPath;
    } finally {
      // Clean up temporary files
      await Promise.all(
        tempFiles.map(file => 
          fs.unlink(file).catch(err => console.error('Error deleting temp file:', err))
        )
      );
    }
  } catch (error) {
    console.error('Error merging PDF with cover:', error);
    throw error;
  }
}

/**
 * Handles PDF upload with cover page
 * @param {Object} file - Multer file object
 * @param {string} sectionName - Name of the section
 * @param {Object} subject - Subject document
 * @param {Object} teacher - Teacher document
 * @returns {Promise<Object>} - File information
 */
async function handlePdfUploadWithCover(file, sectionName, subject, teacher) {
  try {
    const filePath = path.join(file.destination, file.filename);
    
    // Check if this is the first section being uploaded
    let hasAnyFile = false;
    const sectionFields = [
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
    
    // Check if any other section already has a file
    for (const field of sectionFields) {
      if (field !== sectionName && subject[field]?.fileName) {
        hasAnyFile = true;
        break;
      }
    }
    
    const isFirstSection = !hasAnyFile;
    
    // If it's a PDF, merge with cover page(s)
    if (file.mimetype === 'application/pdf') {
      await mergePdfWithCover(filePath, sectionName, subject.subjectName, isFirstSection);
    }
    // For Word documents, they'll be converted to PDF later in the process
    
    return {
      fileName: file.filename,
      fileUrl: `/uploads/${subject.academicYear}/${teacher.department}/${teacher.facultyId}/${subject._id}/${file.filename}`,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Error handling PDF upload with cover:', error);
    throw error;
  }
}

module.exports = {
  createCoverPage,
  mergePdfWithCover,
  handlePdfUploadWithCover
};
