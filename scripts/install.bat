@echo off
REM KinoRez Installation Script for Windows
REM This script sets up KinoRez for development

setlocal enabledelayedexpansion

echo.
echo KinoRez Installation
echo ====================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js is not installed.
    echo Please download and install Node.js 16+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js %NODE_VERSION% detected
echo npm %NPM_VERSION% detected
echo.

REM Install dependencies
echo Installing root dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo Installing server dependencies...
cd server
call npm install
if errorlevel 1 goto error
cd ..

echo.
echo Installing client dependencies...
cd client
call npm install
if errorlevel 1 goto error
cd ..

echo.
echo Setting up environment variables...
if not exist server\.env (
    copy server\.env.example server\.env
    echo Created server\.env
) else (
    echo server\.env already exists
)

echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Review server\.env configuration
echo 2. Run 'npm run dev' to start development
echo 3. Open http://localhost:3000 in your browser
echo.
exit /b 0

:error
echo.
echo Installation failed!
exit /b 1
