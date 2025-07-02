@echo off
title OpenFrontIO Desktop Development
echo ============================================
echo Starting OpenFrontIO Desktop Client in Development Mode...
echo ============================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js could not be found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
)

REM Check if npm is installed
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm could not be found. Please install npm first.
    echo.
    pause
    exit /b 1
) else (
    echo ✓ npm is installed
)

REM Install dependencies if node_modules doesn't exist
echo [3/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies... This may take a few minutes.
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        echo Try running: npm install
        echo.
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)

REM Check if Electron is available
echo [4/5] Checking Electron...
npx electron --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Electron not found. Installing Electron...
    npm install --save-dev electron
    if errorlevel 1 (
        echo ERROR: Failed to install Electron.
        pause
        exit /b 1
    )
)
echo ✓ Electron is ready

REM Option 1: Start Electron pointing to webpack dev server
echo [5/5] Starting desktop client...
echo.
echo IMPORTANT: Make sure the web client is running first!
echo.
echo Choose an option:
echo [1] Start Electron only (web client must be running separately)
echo [2] Start both web client and desktop client
echo [3] Cancel
echo.
set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" goto electron_only
if "%choice%"=="2" goto both
if "%choice%"=="3" goto end
echo Invalid choice. Defaulting to option 2.

:both
echo.
echo Starting game server first...
echo This will start the backend API server.
start "OpenFrontIO Game Server" cmd /k "npm run start:server-dev"
echo Waiting for game server to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting web client...
echo This will start the frontend webpack server.
start "OpenFrontIO Web Client" cmd /k "npm run start:client"
echo Waiting for web server to start...
timeout /t 10 /nobreak >nul

echo.
echo Starting Electron desktop client...
npm run electron-dev
goto end

:electron_only
echo.
echo Starting Electron desktop client...
echo Make sure webpack dev server is running on localhost:8080
npm run electron-dev
goto end

:end
echo.
echo Desktop client session ended.
pause
