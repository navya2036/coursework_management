const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get teacher dashboard
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({
      message: 'Welcome to your dashboard',
      teacher: {
        id: req.teacher._id,
        name: req.teacher.name,
        email: req.teacher.email,
        subject: req.teacher.subject
      },
      dashboard: {
        totalStudents: 0,
        upcomingClasses: [],
        recentActivities: []
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/profile
// @desc    Get teacher profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      teacher: {
        id: req.teacher._id,
        name: req.teacher.name,
        email: req.teacher.email,
        subject: req.teacher.subject,
        createdAt: req.teacher.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 