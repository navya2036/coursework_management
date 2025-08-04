const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get teacher info from request (set by auth middleware)
    const teacher = req.teacher;
    const academicYear = req.body.academicYear || '2024-2025'; // Default academic year
    
    // Fallback for when teacher info is not available (e.g., during testing)
    if (!teacher) {
      const fallbackPath = path.join(__dirname, '..', 'uploads', academicYear, 'temp');
      fs.mkdirSync(fallbackPath, { recursive: true });
      return cb(null, fallbackPath);
    }

    // Create organized folder structure
    const uploadPath = path.join(__dirname, '..', 'uploads', academicYear, teacher.department, teacher.facultyId, teacher.subjectId);
    
    // Create directories if they don't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
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

module.exports = upload; 