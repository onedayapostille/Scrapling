#!/bin/bash

echo "Starting Scrapling Application Locally"
echo "======================================"
echo ""

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "Error: $1 is not installed"
        exit 1
    fi
}

echo "Checking prerequisites..."
check_command python3
check_command node
check_command npm

echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating backend .env from example..."
    cp .env.example .env
fi

echo "Starting backend server..."
python3 main.py &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating frontend .env from example..."
    cp .env.example .env
fi

echo ""
echo "======================================"
echo "Starting frontend development server..."
echo "======================================"
npm run dev

trap "kill $BACKEND_PID" EXIT
