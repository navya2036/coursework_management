const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to create hierarchical folder path
function createHierarchicalPath(academicYear, department, facultyId, subjectId) {
  return path.join(__dirname, '..', 'uploads', academicYear, department, facultyId, subjectId);
}

// Configure storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      // Extract teacher and subject data from request
      const facultyId = req.teacher ? req.teacher.facultyId : null;
      const subjectId = req.params ? req.params.id : null;
      
      // If we don't have the required data, fall back to simple uploads directory
      if (!facultyId || !subjectId) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        return cb(null, uploadPath);
      }
      
      // We need to get the subject data to create the folder structure
      // Import Subject model here to avoid circular dependency
      const Subject = require('../models/Subject');
      const subject = await Subject.findOne({ 
        _id: subjectId, 
        teacher: req.teacher._id 
      });
      
      if (!subject) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        return cb(null, uploadPath);
      }
      
      // Create hierarchical path: academicYear/department/facultyId/subjectId
      const uploadPath = createHierarchicalPath(
        subject.academicYear, 
        subject.department, 
        facultyId, 
        subjectId
      );
      
      // Create directory structure if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    } catch (error) {
      console.error('Upload destination error:', error);
      // Fall back to simple uploads directory
      const uploadPath = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only PDF and Word documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = {
  upload,
  createHierarchicalPath
}; 