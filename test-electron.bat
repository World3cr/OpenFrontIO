@echo off
title Test Electron Connection
echo ========================================
echo   Testing Electron Desktop Connection
echo ========================================
echo.

echo [1/3] Checking if webpack server is running...
curl -s http://localhost:8080 >nul 2>&1
if errorlevel 1 (
    echo ❌ Webpack server is NOT running on localhost:8080
    echo.
    echo Start it with: npm run start:client
    echo Then run this test again.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Webpack server is running
)

echo.
echo [2/3] Testing URL in browser...
echo Opening localhost:8080 in default browser...
start http://localhost:8080

echo.
echo [3/3] Starting Electron...
echo If the browser works but Electron is white, there may be a config issue.
npm run electron-dev

echo.
echo Test completed.
pause
