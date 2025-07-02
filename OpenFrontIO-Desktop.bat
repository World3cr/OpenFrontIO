@echo off
title OpenFrontIO Desktop Client

:start
REM Quick launcher for OpenFrontIO Desktop
cls
echo ========================================
echo       OpenFrontIO Desktop Client
echo ========================================
echo.
echo [1] Complete Setup (RECOMMENDED) - Starts everything
echo [2] Development Mode (Advanced) - Step by step setup
echo [3] Desktop Only - Desktop client only (servers must be running)
echo [4] Web Client Only - Browser version
echo [5] Build Desktop Executable
echo [6] Exit
echo.
set /p choice=Choose an option (1-6): 

if "%choice%"=="1" (
    echo Starting complete setup...
    call COMPLETE-START.bat
    goto start
) else if "%choice%"=="2" (
    echo Starting development mode...
    call start-desktop-dev.bat
    goto start
) else if "%choice%"=="3" (
    echo Starting desktop client only...
    call start-electron-only.bat
    goto start
) else if "%choice%"=="4" (
    echo Starting web client only...
    echo This will start the web version in your browser.
    npm run start:client
    goto start
) else if "%choice%"=="5" (
    echo Building desktop executable...
    call build-desktop.bat
    goto start
) else if "%choice%"=="6" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    pause
    goto start
)
