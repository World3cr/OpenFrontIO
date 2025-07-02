@echo off
echo ================================
echo   OpenFrontIO Electron Port Test
echo ================================
echo.
echo This will test if Electron loads from the correct port (9000)
echo.
echo Step 1: Starting development server...
start cmd /k "npm run dev"
echo.
echo Waiting 10 seconds for server to start...
timeout /t 10 /nobreak > nul
echo.
echo Step 2: Starting Electron desktop client...
echo (It should now connect to port 9000 automatically)
echo.
npm run electron
echo.
echo Test complete!
pause
