#!/bin/bash

# Healthcare Application Setup Script
# This script automates the local setup process

echo "🏥 Healthcare Application Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Python is installed
check_python() {
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        print_error "Python is not installed. Please install Python 3.8+ and try again."
        exit 1
    fi
    
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2)
    print_status "Found Python $PYTHON_VERSION"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Found Node.js $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_step "Setting up Django backend..."
    
    cd healthcare_backend || exit 1
    
    # Create virtual environment
    print_status "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
    
    # Activate virtual environment
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << EOL
# Django Settings
SECRET_KEY=django-insecure-local-development-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database (SQLite for development)
USE_SQLITE=true

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173

# API Settings
API_BASE_URL=http://localhost:12000
EOL
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    $PYTHON_CMD manage.py makemigrations
    $PYTHON_CMD manage.py migrate
    
    # Create sample data
    print_status "Creating sample data..."
    $PYTHON_CMD create_sample_data.py
    
    print_status "Backend setup complete!"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_step "Setting up React frontend..."
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating frontend .env file..."
        cat > .env << EOL
# API Configuration
VITE_API_BASE_URL=http://localhost:12000
VITE_API_TIMEOUT=10000

# Development Settings
VITE_NODE_ENV=development
EOL
    fi
    
    print_status "Frontend setup complete!"
}

# Create start scripts
create_start_scripts() {
    print_step "Creating start scripts..."
    
    # Backend start script
    cat > start_backend.sh << 'EOL'
#!/bin/bash
echo "Starting Healthcare Backend..."
cd healthcare_backend
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
python manage.py runserver 0.0.0.0:12000
EOL
    
    # Frontend start script
    cat > start_frontend.sh << 'EOL'
#!/bin/bash
echo "Starting Healthcare Frontend..."
npm run dev
EOL
    
    # Make scripts executable
    chmod +x start_backend.sh
    chmod +x start_frontend.sh
    
    # Windows batch files
    cat > start_backend.bat << 'EOL'
@echo off
echo Starting Healthcare Backend...
cd healthcare_backend
call venv\Scripts\activate
python manage.py runserver 0.0.0.0:12000
pause
EOL
    
    cat > start_frontend.bat << 'EOL'
@echo off
echo Starting Healthcare Frontend...
npm run dev
pause
EOL
    
    print_status "Start scripts created!"
}

# Main setup function
main() {
    print_step "Starting Healthcare Application Setup..."
    
    # Check prerequisites
    check_python
    check_node
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Create start scripts
    create_start_scripts
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "To start the application:"
    echo ""
    echo "1. Start the backend server:"
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "   ./start_backend.bat"
    else
        echo "   ./start_backend.sh"
    fi
    echo "   Backend will be available at: http://localhost:12000"
    echo ""
    echo "2. In a new terminal, start the frontend:"
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "   ./start_frontend.bat"
    else
        echo "   ./start_frontend.sh"
    fi
    echo "   Frontend will be available at: http://localhost:5173"
    echo ""
    echo "Test accounts:"
    echo "- Patient: patient1 / password123"
    echo "- Physiotherapist: physio1 / password123"
    echo "- Admin: admin / admin123"
    echo ""
    echo "For detailed instructions, see: LOCAL_SETUP_GUIDE.md"
}

# Run main function
main "$@"