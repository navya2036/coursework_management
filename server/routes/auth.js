const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Login teacher
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if teacher exists with matching email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches faculty ID
    if (teacher.facultyId !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(teacher._id);

    res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        facultyId: teacher.facultyId,
        subjectId: teacher.subjectId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current teacher
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      teacher: {
        id: req.teacher._id,
        name: req.teacher.name,
        email: req.teacher.email,
        department: req.teacher.department,
        facultyId: req.teacher.facultyId,
        subjectId: req.teacher.subjectId
      }
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 