@echo off
REM KinoRez Development Script for Windows
REM Starts both frontend and backend servers

setlocal enabledelayedexpansion

echo.
echo KinoRez Development Server
echo ===========================
echo.

REM Check if dependencies are installed
if not exist node_modules (
    echo Error: Dependencies not installed. Run: npm install
    exit /b 1
)

if not exist server\node_modules (
    echo Error: Server dependencies not installed. Run: cd server ^&^& npm install
    exit /b 1
)

if not exist client\node_modules (
    echo Error: Client dependencies not installed. Run: cd client ^&^& npm install
    exit /b 1
)

REM Check for .env file
if not exist server\.env (
    echo Error: server\.env not found. Run: copy server\.env.example server\.env
    exit /b 1
)

echo All dependencies installed
echo Configuration files present
echo.

REM Run dev servers
echo Starting development servers...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
