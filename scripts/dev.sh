#!/bin/bash

# KinoRez Development Script
# Starts both frontend and backend servers

set -e

echo "🎬 KinoRez Development Server"
echo "============================="
echo ""

# Check if dependencies are installed
if [ ! -d node_modules ]; then
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

if [ ! -d server/node_modules ]; then
    echo "❌ Server dependencies not installed. Run: cd server && npm install"
    exit 1
fi

if [ ! -d client/node_modules ]; then
    echo "❌ Client dependencies not installed. Run: cd client && npm install"
    exit 1
fi

# Check for .env file
if [ ! -f server/.env ]; then
    echo "❌ server/.env not found. Run: cp server/.env.example server/.env"
    exit 1
fi

echo "✅ All dependencies installed"
echo "✅ Configuration files present"
echo ""

# Run dev servers
echo "🚀 Starting development servers..."
echo ""
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
