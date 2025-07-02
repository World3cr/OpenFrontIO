@echo off
title OpenFrontIO Desktop - Electron Only
echo ============================================
echo   OpenFrontIO Desktop Client (Electron Only)
echo ============================================
echo.
echo This will start the desktop client only.
echo Make sure the web client is running on localhost:8080 first.
echo.
echo You can start the web client separately with:
echo   npm run start:client
echo.
pause

echo Starting Electron desktop client...
npm run electron-dev

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start Electron.
    echo Make sure you have run 'npm install' first.
    echo.
    pause
    exit /b 1
)

echo.
echo Desktop client closed.
pause
