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
    enum: ['1', '2'],
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
  timetable: {
    description: {
      type: String,
      default: 'Upload your class timetable here. Include class timings, room numbers, and schedule details.'
    },
    fileName: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  lessonplan: {
    description: {
      type: String,
      default: 'Upload your lesson plan here. Include topics, objectives, teaching methods, and assessment strategies.'
    },
    fileName: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  midsheets: {
    description: {
      type: String,
      default: 'Upload your mid-semester sheets here. Include question papers, answer keys, and evaluation criteria.'
    },
    fileName: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', subjectSchema); 