const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Teacher = require('../models/Teacher');

// Load environment variables from the correct path
dotenv.config({ path: './config.env' });

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@svcew.edu.in',
  password: 'admin@123', // This will be hashed
  facultyId: 'ADMIN001',
  department: 'CSE',
  isAdmin: true
};

async function setupAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in config.env');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing teacher data...');
    await Teacher.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    const admin = new Teacher(adminUser);
    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('\n⚠️ Please change this password after first login!\n');

  } catch (error) {
    console.error('Error setting up admin:', error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.error('\nPlease make sure you have a config.env file in the server directory with MONGODB_URI defined.');
      console.error('Example config.env content:');
      console.error('MONGODB_URI=mongodb://localhost:27017/teacher_portal');
    }
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
}

// Run the setup
setupAdmin();