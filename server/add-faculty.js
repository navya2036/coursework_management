const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
require('dotenv').config();

// Sample faculty data
const facultyData = [
  {
    name: 'Dr. John Smith',
    email: 'john.smith@college.edu',
    password: 'FAC001',
    department: 'CSE',
    facultyId: 'FAC001',
    subjectId: 'CS101'
  },
  {
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    password: 'FAC002',
    department: 'AI',
    facultyId: 'FAC002',
    subjectId: 'AI201'
  },
  {
    name: 'Dr. Michael Brown',
    email: 'michael.brown@college.edu',
    password: 'FAC003',
    department: 'AI',
    facultyId: 'FAC003',
    subjectId: 'ML301'
  },
  {
    name: 'Prof. Emily Davis',
    email: 'emily.davis@college.edu',
    password: 'FAC004',
    department: 'IT',
    facultyId: 'FAC004',
    subjectId: 'IT401'
  },
  {
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@college.edu',
    password: 'FAC005',
    department: 'CYBER_SECURITY',
    facultyId: 'FAC005',
    subjectId: 'CS501'
  },
  {
    name: 'Prof. Lisa Anderson',
    email: 'lisa.anderson@college.edu',
    password: 'FAC006',
    department: 'ECE',
    facultyId: 'FAC006',
    subjectId: 'EC601'
  },
  {
    name: 'Dr. David Martinez',
    email: 'david.martinez@college.edu',
    password: 'FAC007',
    department: 'EEE',
    facultyId: 'FAC007',
    subjectId: 'EE701'
  },
  {
    name: 'Prof. Jennifer Taylor',
    email: 'jennifer.taylor@college.edu',
    password: 'FAC008',
    department: 'CIVIL',
    facultyId: 'FAC008',
    subjectId: 'CV801'
  },
  {
    name: 'Dr. Christopher Lee',
    email: 'christopher.lee@college.edu',
    password: 'FAC009',
    department: 'MECH',
    facultyId: 'FAC009',
    subjectId: 'ME901'
  }
];

async function addFaculty() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing faculty data
    await Teacher.deleteMany({});
    console.log('Cleared existing faculty data');

    // Add new faculty data
    for (const faculty of facultyData) {
      const teacher = new Teacher(faculty);
      await teacher.save();
      console.log(`Added faculty: ${faculty.name} (${faculty.email})`);
    }

    console.log('All faculty data added successfully!');
    console.log('\nLogin Credentials:');
    console.log('==================');
    facultyData.forEach(faculty => {
      console.log(`Email: ${faculty.email} | Password: ${faculty.facultyId}`);
    });

  } catch (error) {
    console.error('Error adding faculty data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addFaculty(); 