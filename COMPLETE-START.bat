@echo off
title OpenFrontIO Desktop - Complete Setup
echo =============================================
echo   OpenFrontIO Desktop - Complete Setup
echo =============================================
echo.
echo This will start:
echo 1. Game Server (Backend API)
echo 2. Web Client (Frontend)  
echo 3. Desktop Client (Electron)
echo.
pause

echo [1/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
)
echo ✓ Dependencies ready

echo.
echo [2/4] Starting Game Server (Backend)...
echo This provides the game logic and API endpoints.
start "Game Server" cmd /k "echo Starting Game Server... && npm run start:server-dev"
echo Waiting for game server to initialize...
timeout /t 8 /nobreak >nul

echo.
echo [3/4] Starting Web Client (Frontend)...
echo This serves the game interface.
start "Web Client" cmd /k "echo Starting Web Client... && npm run start:client"
echo Waiting for web client to build...
timeout /t 12 /nobreak >nul

echo.
echo [4/4] Starting Desktop Client...
echo The desktop window should open now with the full game.
npm run electron-dev

if errorlevel 1 (
    echo.
    echo ERROR: Desktop client failed to start.
    echo.
    echo Troubleshooting:
    echo - Check if both server windows are still running
    echo - Make sure localhost:8080 is accessible
    echo - Try restarting the servers
    echo.
)

echo.
echo =============================================
echo Desktop session ended.
echo.
echo The Game Server and Web Client are still running.
echo You can:
echo - Close the server windows manually
echo - Or press Ctrl+C in each server window
echo =============================================
pause
