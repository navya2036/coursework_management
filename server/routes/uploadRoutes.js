const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const Faculty = require('../models/Faculty');
const { cleanEmptyFolders } = require('../utils/cleanupUtils');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { facultyId, subjectId } = req.body;
    try {
      const faculty = await Faculty.findOne({ facultyId: facultyId });
      if (!faculty) {
        return cb(new Error('Faculty not found'));
      }
      const uploadPath = path.join(__dirname, '../uploads', faculty.department, facultyId, subjectId);
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original name and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    cb(null, `${fileName}-${uniqueSuffix}${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Add file type validation if needed
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Delete file handler
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    await cleanEmptyFolders(path.join(__dirname, '../uploads'));
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = { upload, deleteFile };