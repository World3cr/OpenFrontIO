@echo off
title OpenFrontIO - Webpack Server Only
echo ========================================
echo   Starting Webpack Development Server
echo ========================================
echo.
echo This will start ONLY the webpack development server.
echo The server will run on: http://localhost:8080
echo.
echo To stop the server: Press Ctrl+C
echo.
pause

echo Starting webpack development server...
npm run start:client

echo.
echo Webpack server stopped.
pause
