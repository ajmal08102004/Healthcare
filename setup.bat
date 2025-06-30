@echo off
REM Healthcare Application Setup Script for Windows
REM This script automates the local setup process

echo 🏥 Healthcare Application Setup
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo [INFO] Found Python and Node.js

REM Setup backend
echo [STEP] Setting up Django backend...
cd healthcare_backend

REM Create virtual environment
echo [INFO] Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file...
    (
        echo # Django Settings
        echo SECRET_KEY=django-insecure-local-development-key-change-in-production
        echo DEBUG=True
        echo ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
        echo.
        echo # Database ^(SQLite for development^)
        echo USE_SQLITE=true
        echo.
        echo # CORS Settings
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
        echo.
        echo # API Settings
        echo API_BASE_URL=http://localhost:12000
    ) > .env
)

REM Run migrations
echo [INFO] Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create sample data
echo [INFO] Creating sample data...
python create_sample_data.py

echo [INFO] Backend setup complete!
cd ..

REM Setup frontend
echo [STEP] Setting up React frontend...

REM Install dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating frontend .env file...
    (
        echo # API Configuration
        echo VITE_API_BASE_URL=http://localhost:12000
        echo VITE_API_TIMEOUT=10000
        echo.
        echo # Development Settings
        echo VITE_NODE_ENV=development
    ) > .env
)

echo [INFO] Frontend setup complete!

REM Create start scripts
echo [STEP] Creating start scripts...

REM Backend start script
(
    echo @echo off
    echo echo Starting Healthcare Backend...
    echo cd healthcare_backend
    echo call venv\Scripts\activate
    echo python manage.py runserver 0.0.0.0:12000
    echo pause
) > start_backend.bat

REM Frontend start script
(
    echo @echo off
    echo echo Starting Healthcare Frontend...
    echo npm run dev
    echo pause
) > start_frontend.bat

echo [INFO] Start scripts created!

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the application:
echo.
echo 1. Start the backend server:
echo    start_backend.bat
echo    Backend will be available at: http://localhost:12000
echo.
echo 2. In a new terminal, start the frontend:
echo    start_frontend.bat
echo    Frontend will be available at: http://localhost:5173
echo.
echo Test accounts:
echo - Patient: patient1 / password123
echo - Physiotherapist: physio1 / password123
echo - Admin: admin / admin123
echo.
echo For detailed instructions, see: LOCAL_SETUP_GUIDE.md
echo.
pause