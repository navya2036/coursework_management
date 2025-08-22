#!/bin/bash
echo "Setting up Teacher Portal..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "Node.js is not installed. Please install Node.js v14 or later and try again."
    echo "You can download it from: https://nodejs.org/"
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

echo "[1/4] Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install server dependencies"
    exit 1
fi

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env <<EOL
MONGODB_URI=mongodb://localhost:27017/teacher_portal
JWT_SECRET=your_jwt_secret_here
PORT=5000
EOL
    echo ".env file created with default values. Please update with your configuration."
fi

cd ..

echo "[2/4] Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install client dependencies"
    exit 1
fi
cd ..

# Check if MongoDB is running
if command_exists mongod; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "[3/4] MongoDB is not running. Attempting to start..."
        if command_exists systemctl; then
            sudo systemctl start mongod
        elif command_exists service; then
            sudo service mongod start
        else
            echo "Could not start MongoDB automatically. Please start MongoDB manually and run this script again."
            exit 1
        fi
    else
        echo "[3/4] MongoDB is already running."
    fi
else
    echo "[3/4] MongoDB is not installed. Please install MongoDB and run this script again."
    echo "You can download MongoDB from: https://www.mongodb.com/try/download/community"
    exit 1
fi

echo "[4/4] Starting the application..."
# Start server in background
(cd server && npm start) &

# Give server time to start
sleep 3

# Start client in background
(cd client && npm start) &

echo ""
echo "======================================="
echo "Teacher Portal setup complete!"
echo "======================================="
echo ""
echo "Application is starting..."
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "Default Admin Credentials:"
echo "- Email: admin@svcew.edu.in"
echo "- Password: admin@123"
echo ""
echo "IMPORTANT: Change the default admin password after first login!"

# Keep the script running
wait
