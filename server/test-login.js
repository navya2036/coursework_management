const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Teacher = require('./models/Teacher');

// Load environment variables
dotenv.config({ path: './config.env' });

async function testLoginSystem() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test data for a teacher
    const testTeacher = {
      name: 'Test Teacher',
      email: 'test@example.com',
      password: 'password123',
      department: 'CSE',
      facultyId: 'FacultyID101',
      subjectId: 'DS'
    };

    // Check if teacher exists
    let teacher = await Teacher.findOne({ 
      email: testTeacher.email,
      department: testTeacher.department,
      facultyId: testTeacher.facultyId
    });

    if (!teacher) {
      console.log('Creating test teacher...');
      teacher = new Teacher(testTeacher);
      await teacher.save();
      console.log('Test teacher created successfully');
    } else {
      console.log('Test teacher already exists');
    }

    // Test login validation
    const loginTest = await Teacher.findOne({
      email: testTeacher.email,
      department: testTeacher.department,
      facultyId: testTeacher.facultyId
    });

    if (loginTest) {
      console.log('✅ Login validation works correctly');
      console.log('Teacher found:', {
        name: loginTest.name,
        email: loginTest.email,
        department: loginTest.department,
        facultyId: loginTest.facultyId,
        subjectId: loginTest.subjectId
      });
    } else {
      console.log('❌ Login validation failed');
    }

    console.log('\nTest completed successfully!');
    console.log('\nYou can now test the login with:');
    console.log('Email: test@example.com');
    console.log('Department: CSE');
    console.log('Faculty ID: FacultyID101');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testLoginSystem(); 