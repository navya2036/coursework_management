# Teacher Authentication System - MERN Stack

A complete MERN stack application with JWT-based authentication for teachers. Teachers can sign up, log in, and access their personalized dashboard.

## Features

- **Teacher Authentication**: Signup and login with email/password
- **JWT-based Security**: Secure token-based authentication
- **Protected Routes**: Dashboard only accessible to authenticated users
- **Modern UI**: Clean and responsive design
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
teacher-auth-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

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