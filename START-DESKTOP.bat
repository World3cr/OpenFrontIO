@echo off
title OpenFrontIO Desktop - Auto Start
echo ============================================
echo   OpenFrontIO Desktop - Automatic Setup
echo ============================================
echo.

REM Kill any existing processes first
taskkill /F /IM "electron.exe" 2>nul
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq webpack*" 2>nul

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

echo [2/4] Starting webpack development server...
start "WebpackDevServer" cmd /c "npm run start:client"

echo [3/4] Waiting for server to start...
:check_server
timeout /t 2 /nobreak >nul
curl -f http://localhost:8080 >nul 2>&1
if errorlevel 1 (
    echo Waiting for webpack dev server...
    goto check_server
)
echo ✓ Webpack dev server is running

echo [4/4] Starting Electron desktop client...
echo.
npm run electron-dev

echo.
echo Cleaning up...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq WebpackDevServer" 2>nul

echo Desktop client closed.
pause
