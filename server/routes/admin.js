const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const multer = require('multer');
const xlsx = require('xlsx');

// @route   POST /api/admin/faculty/upload
// @desc    Upload faculty data from Excel
// @access  Private/Admin
router.post('/faculty/upload', auth, isAdmin, async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const facultyData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process and validate faculty data
    const processedFaculty = facultyData.map(faculty => ({
      name: faculty.Name,
      email: faculty.Email,
      facultyId: faculty.FacultyID,
      department: faculty.Department,
      password: faculty.Password || faculty.FacultyID, // Default to faculty ID if no password
      isAdmin: false // Only the first admin can create other admins
    }));

    // Insert into database
    await Teacher.insertMany(processedFaculty, { ordered: false });
    
    res.json({ message: 'Faculty data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading faculty data:', error);
    res.status(500).json({ message: 'Error processing faculty data' });
  }
});

// @route   GET /api/admin/faculty
// @desc    Get all faculty members
// @access  Private/Admin
router.get('/faculty', auth, isAdmin, async (req, res) => {
  try {
    const faculty = await Teacher.find().select('-password');
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/faculty/:id
// @desc    Update faculty member
// @access  Private/Admin
router.put('/faculty/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Don't allow changing admin status through this route
    if ('isAdmin' in updateData) {
      delete updateData.isAdmin;
    }

    const faculty = await Teacher.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    
    res.json(faculty);
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/faculty/:id
// @desc    Delete faculty member
// @access  Private/Admin
router.delete('/faculty/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (id === req.teacher.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const faculty = await Teacher.findByIdAndDelete(id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
