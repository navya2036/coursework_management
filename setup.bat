@echo off
echo Setting up Teacher Portal...
echo.

echo [1/4] Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install server dependencies
    exit /b 1
)

if not exist .env (
    echo Creating .env file...
    copy /Y NUL .env >NUL
    echo MONGODB_URI=mongodb://localhost:27017/teacher_portal>> .env
    echo JWT_SECRET=your_jwt_secret_here>> .env
    echo PORT=5000>> .env
    echo .env file created with default values. Please update with your configuration.
)

cd ..

echo [2/4] Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install client dependencies
    exit /b 1
)
cd ..

echo [3/4] Starting MongoDB service...
net start MongoDB >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB service is not running. Please make sure MongoDB is installed and running.
    echo You can download MongoDB from: https://www.mongodb.com/try/download/community
    echo.
    set /p start_mongodb="Start MongoDB manually and press any key to continue..."
)

echo [4/4] Starting the application...
start "" "cmd /k cd server && npm start"
timeout /t 3 >nul
start "" "cmd /k cd client && npm start"

echo.
echo =======================================
echo Teacher Portal setup complete!
echo =======================================
echo.
echo Application is starting...
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
echo Default Admin Credentials:
echo - Email: admin@svcew.edu.in
echo - Password: admin@123
echo.
echo "IMPORTANT: Change the default admin password after first login!"
pause
