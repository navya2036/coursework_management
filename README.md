# Teacher Portal - Coursework Management System

A comprehensive MERN stack application for managing teacher coursework, built with JWT-based authentication and role-based access control.

## Features

- **Role-based Access**: Admin and Teacher roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Faculty Management**: Add, view, update, and delete faculty members (Admin only)
- **Coursework Tracking**: Manage subjects and course materials
- **Bulk Import**: Import faculty data via Excel files
- **Modern UI**: Clean, responsive design with intuitive navigation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **XLSX** - Excel file processing

### Frontend
- **React** - Frontend library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern layouts

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Quick Start

Run this single command to install dependencies and start both frontend and backend:

```bash
# On Windows
cd server && npm install && cd ../client && npm install && cd .. && start "" "cmd /k cd server && npm start" && start "" "cmd /k cd client && npm start"

# On macOS/Linux
cd server && npm install && cd ../client && npm install && cd .. && (cd server && npm start &) && (cd client && npm start &)
```

## Manual Setup

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/teacher_portal
# JWT_SECRET=your_jwt_secret_here

# Start the server
npm start
# or for development with auto-restart
# npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

## Default Admin Credentials

- **Email**: admin@svcew.edu.in
- **Password**: admin@123

**Important**: Change the default password after first login.

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Available Scripts

### Server (from /server directory)
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Client (from /client directory)
- `npm start` - Start the React development server
- `npm run build` - Build for production

## Project Structure

```
coursework-management/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable components
│       ├── App.js          # Main app component
│       └── index.js        # Entry point
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Utility scripts
│   ├── server.js          # Main server file
│   └── .env               # Environment variables
└── README.md
```

## Bulk Faculty Import

Admins can import faculty data using an Excel file with these columns:
- Name
- Email
- FacultyID
- Department
- Password (optional, defaults to FacultyID)

## License

This project is licensed under the MIT License.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd teacher-auth-mern
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the server directory:
   ```bash
   cd server
   cp config.env .env
   ```
   
   Edit the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/teacher_auth_db
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the MONGODB_URI in your .env file.

5. **Run the application**

   **Development mode (both client and server):**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

   **Run separately:**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new teacher
- `POST /api/auth/login` - Login teacher
- `GET /api/auth/me` - Get current teacher (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)
- `GET /api/dashboard/profile` - Get teacher profile (protected)

## Usage

1. **Sign Up**: Visit `/signup` to create a new teacher account
2. **Login**: Visit `/login` to access your account
3. **Dashboard**: After authentication, you'll be redirected to your dashboard
4. **Logout**: Use the logout button in the navbar

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Protected Routes**: Server-side middleware protects sensitive endpoints
- **Input Validation**: Both client and server-side validation
- **CORS**: Configured for secure cross-origin requests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/teacher_auth_db |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| NODE_ENV | Environment mode | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License 