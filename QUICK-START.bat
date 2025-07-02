@echo off
title OpenFrontIO Desktop - Quick Start
echo ============================================
echo   OpenFrontIO Desktop Client - Quick Start
echo ============================================
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies first time...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting desktop client...
echo (This connects to localhost:8080 - make sure web client is running)
echo.

REM Start Electron directly
npm run electron-dev

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start desktop client.
    echo.
    echo Troubleshooting:
    echo 1. Make sure you have Node.js installed
    echo 2. Try running: npm install
    echo 3. Start web client first: npm run start:client
    echo.
)

pause
