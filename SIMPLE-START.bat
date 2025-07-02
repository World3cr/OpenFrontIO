@echo off
title OpenFrontIO Desktop - Simple Start
echo ============================================
echo   OpenFrontIO Desktop - Simple Start
echo ============================================
echo.

echo Step 1: Starting game server (backend)...
echo (This provides the API and game logic)
start "OpenFrontIO Game Server" cmd /k "npm run start:server-dev"

echo.
echo Step 2: Starting webpack development server (frontend)...
echo (This serves the web client)
start "OpenFrontIO Web Client" cmd /k "npm run start:client"

echo.
echo Step 3: Waiting for servers to initialize...
echo Please wait 15 seconds for both servers to start...
timeout /t 15 /nobreak

echo.
echo Step 4: Starting Electron desktop client...
echo (The desktop window should open now)
npm run electron-dev

echo.
echo Desktop session ended.
echo The game server and webpack server are still running in other windows.
echo You can close them manually or they will close when you close those command windows.
pause
