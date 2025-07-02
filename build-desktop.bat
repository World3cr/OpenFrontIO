@echo off
echo Building OpenFrontIO Desktop Client for Production...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js could not be found. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
)

REM Build the web client
echo Building web client...
npm run build-prod
if errorlevel 1 (
    echo Failed to build web client.
    pause
    exit /b 1
)

REM Build the desktop executable
echo Building desktop executable...
npm run build-desktop
if errorlevel 1 (
    echo Failed to build desktop executable.
    pause
    exit /b 1
)

echo Build completed! Check the 'dist' folder for the executable.
echo.
echo Generated files:
echo - OpenFrontIO-Setup-[version].exe (Installer)
echo - OpenFrontIO-[version]-x64.exe (Portable)
echo.
pause
