# System Updates and Fixes

## Issues Fixed

### 1. "Invalid Section Name" Error
**Problem**: The system was showing "invalid section name" when uploading files to sections in coursework.

**Solution**: 
- Removed hardcoded section validation in `server/routes/subjects.js`
- Now allows any section name instead of restricting to only 'timetable', 'lessonplan', 'midsheets'
- Updated validation to only check if section name is provided and not empty

### 2. Organized Upload Folder Structure
**Problem**: Files were being uploaded to a flat structure in `/uploads/`

**Solution**: Implemented organized folder structure:
```
/uploads/
└── 2024-2025/
    ├── CSE/
    │   └── FacultyID101/
    │       ├── DS/
    │       └── OS/
    ├── AIDS/
    │   └── FacultyID102/
    │       ├── BDA/
    │       └── IOT/
    ├── AIML/
    │   └── FacultyID123/
    │       ├── ML/
    │       └── DL/
    ├── IT/
    │   └── FacultyID104/
    │       ├── SE/
    │       └── DBMS/
    ├── CYBER_SECURITY/
    │   └── FacultyID105/
    │       ├── NETWORKS/
    │       └── ETHICAL_HACKING/
    ├── ECE/
    │   └── FacultyID106/
    │       ├── DSP/
    │       └── VLSI/
    ├── EEE/
    │   └── FacultyID107/
    │       ├── POWER_SYSTEMS/
    │       └── EMF/
    ├── CIVIL/
    │   └── FacultyID108/
    │       ├── STRUCTURES/
    │       └── SURVEYING/
    └── MECH/
        └── FacultyID109/
            ├── THERMODYNAMICS/
            └── CAD/
```

## New Login System

### Updated Teacher Model
- Added `department` field (enum: CSE, AIDS, AIML, IT, CYBER_SECURITY, ECE, EEE, CIVIL, MECH)
- Added `facultyId` field (string)
- Changed `subject` field to `subjectId` field (string)

### Updated Login Process
- **Email**: Teacher's email address
- **Department**: Dropdown selection from available departments
- **Faculty ID**: Used as password (no separate password field)

### Updated Signup Process
- **Name**: Teacher's full name
- **Email**: Teacher's email address
- **Department**: Dropdown selection
- **Faculty ID**: Unique faculty identifier
- **Subject ID**: Subject identifier
- **Password**: Traditional password for account security

## Files Modified

### Backend Changes
1. `server/models/Teacher.js` - Updated schema with new fields
2. `server/middleware/upload.js` - Updated to create organized folder structure
3. `server/routes/auth.js` - Updated login/signup routes
4. `server/routes/subjects.js` - Fixed section validation
5. `server/setup-uploads.js` - Script to create folder structure
6. `server/test-login.js` - Test script for new login system

### Frontend Changes
1. `client/src/components/Login.js` - Updated with department dropdown and faculty ID field
2. `client/src/components/Signup.js` - Updated with new fields
3. `client/src/App.js` - Updated login/signup function calls

## How to Use

### For Teachers
1. **Login**: Use email, select department, and enter faculty ID
2. **Upload Files**: Files will be automatically organized in the correct folder structure
3. **Create Sections**: Any section name is now allowed (no restrictions)

### For Administrators
1. Run `node setup-uploads.js` to create the folder structure
2. Run `node test-login.js` to test the login system
3. Files are automatically organized by academic year → department → faculty ID → subject ID

## Test Account
- **Email**: test@example.com
- **Department**: CSE
- **Faculty ID**: FacultyID101

## Technical Details

### Upload Process
1. Files are uploaded to: `/uploads/{academicYear}/{department}/{facultyId}/{subjectId}/`
2. File paths are stored as relative paths in the database
3. Static file serving is configured to serve from `/uploads/` directory

### Authentication
- Login now validates email + department + faculty ID combination
- No password required for login (faculty ID serves as password)
- Signup still requires a password for account security

### Database Changes
- Teacher model now includes department, facultyId, and subjectId fields
- Existing teachers may need to be updated with new field values
- Subject model remains unchanged but works with new folder structure 