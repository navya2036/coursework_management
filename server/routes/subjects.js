const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Subject = require('../models/Subject');
const fs = require('fs');
const path = require('path');
const PDFMerger = require('pdf-merger-js');
const mammoth = require('mammoth');
const { jsPDF } = require('jspdf');

const router = express.Router();

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
    const { academicYear, year, semester, subjectCode, subjectName, regulation } = req.body;

    // Check if all required fields are provided
    if (!academicYear || !year || !semester || !subjectCode || !subjectName || !regulation) {
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
      regulation
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
    const { academicYear, year, semester, subjectCode, subjectName, regulation } = req.body;

    // Check if all required fields are provided
    if (!academicYear || !year || !semester || !subjectCode || !subjectName || !regulation) {
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

    // Delete associated files
    const sections = ['timetable', 'lessonplan', 'midsheets'];
    for (const section of sections) {
      if (subject[section].fileName) {
        const filePath = path.join(__dirname, '..', 'uploads', subject[section].fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
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
    const validSections = ['timetable', 'lessonplan', 'midsheets'];
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
        const oldFilePath = path.join(__dirname, '..', 'uploads', subject[sectionName].fileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update file information
      subject[sectionName].fileName = req.file.filename;
      subject[sectionName].fileUrl = `/uploads/${req.file.filename}`;
      subject[sectionName].uploadedAt = new Date();
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
    const validSections = ['timetable', 'lessonplan', 'midsheets'];
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
      const filePath = path.join(__dirname, '..', 'uploads', subject[sectionName].fileName);
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

    const sections = [
      { name: 'timetable', title: 'Timetable' },
      { name: 'lessonplan', title: 'Lesson Plan' },
      { name: 'midsheets', title: 'Mid Sheets' }
    ];

    // Check if there are any files to merge
    const sectionsWithFiles = sections.filter(section => 
      subject[section.name].fileName && subject[section.name].fileName.trim() !== ''
    );

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
    for (const section of sectionsWithFiles) {
      const fileName = subject[section.name].fileName;
      const filePath = path.join(__dirname, '..', 'uploads', fileName);
      
      if (fs.existsSync(filePath)) {
        const fileExt = path.extname(fileName).toLowerCase();
        
        if (fileExt === '.pdf') {
          // Add PDF directly
          await merger.add(filePath);
        } else if (fileExt === '.doc' || fileExt === '.docx') {
          // Convert Word document to PDF first
          const tempPdfPath = path.join(tempDir, `${section.name}_${Date.now()}.pdf`);
          const converted = await convertWordToPdf(filePath, tempPdfPath);
          
          if (converted && fs.existsSync(tempPdfPath)) {
            await merger.add(tempPdfPath);
            // Clean up temp file after adding to merger
            setTimeout(() => {
              if (fs.existsSync(tempPdfPath)) {
                fs.unlinkSync(tempPdfPath);
              }
            }, 1000);
          }
        }
      }
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