const fs = require('fs');
const path = require('path');

// Define the folder structure
const academicYear = '2024-2025';
const departments = [
  'CSE', 'AIDS', 'AIML', 'IT', 'CYBER_SECURITY', 'ECE', 'EEE', 'CIVIL', 'MECH'
];

// Faculty IDs and their subjects for each department
const facultyStructure = {
  'CSE': {
    'FacultyID101': ['DS', 'OS']
  },
  'AIDS': {
    'FacultyID102': ['BDA', 'IOT']
  },
  'AIML': {
    'FacultyID123': ['ML', 'DL']
  },
  'IT': {
    'FacultyID104': ['SE', 'DBMS']
  },
  'CYBER_SECURITY': {
    'FacultyID105': ['NETWORKS', 'ETHICAL_HACKING']
  },
  'ECE': {
    'FacultyID106': ['DSP', 'VLSI']
  },
  'EEE': {
    'FacultyID107': ['POWER_SYSTEMS', 'EMF']
  },
  'CIVIL': {
    'FacultyID108': ['STRUCTURES', 'SURVEYING']
  },
  'MECH': {
    'FacultyID109': ['THERMODYNAMICS', 'CAD']
  }
};

function createFolderStructure() {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  // Create main uploads directory
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Create academic year directory
  const academicYearDir = path.join(uploadsDir, academicYear);
  if (!fs.existsSync(academicYearDir)) {
    fs.mkdirSync(academicYearDir, { recursive: true });
    console.log(`Created academic year directory: ${academicYear}`);
  }

  // Create department and faculty folders
  for (const department of departments) {
    const deptDir = path.join(academicYearDir, department);
    if (!fs.existsSync(deptDir)) {
      fs.mkdirSync(deptDir, { recursive: true });
      console.log(`Created department directory: ${department}`);
    }

    // Create faculty folders for this department
    if (facultyStructure[department]) {
      for (const [facultyId, subjects] of Object.entries(facultyStructure[department])) {
        const facultyDir = path.join(deptDir, facultyId);
        if (!fs.existsSync(facultyDir)) {
          fs.mkdirSync(facultyDir, { recursive: true });
          console.log(`Created faculty directory: ${facultyId} in ${department}`);
        }

        // Create subject folders for this faculty
        for (const subject of subjects) {
          const subjectDir = path.join(facultyDir, subject);
          if (!fs.existsSync(subjectDir)) {
            fs.mkdirSync(subjectDir, { recursive: true });
            console.log(`Created subject directory: ${subject} in ${facultyId}`);
          }
        }
      }
    }
  }

  console.log('\nFolder structure created successfully!');
  console.log('\nStructure:');
  console.log(`/${academicYear}/`);
  for (const department of departments) {
    console.log(`  ${department}/`);
    if (facultyStructure[department]) {
      for (const [facultyId, subjects] of Object.entries(facultyStructure[department])) {
        console.log(`    ${facultyId}/`);
        for (const subject of subjects) {
          console.log(`      ${subject}/`);
        }
      }
    }
  }
}

// Run the setup
createFolderStructure(); 