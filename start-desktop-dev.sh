#!/bin/bash

# OpenFrontIO Desktop Client Development Script

echo "Starting OpenFrontIO Desktop Client in Development Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js could not be found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm could not be found. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the webpack dev server in background
echo "Starting webpack development server..."
npm run start:client &
WEBPACK_PID=$!

# Wait for webpack to start
echo "Waiting for webpack dev server to start..."
sleep 5

# Start Electron
echo "Starting Electron desktop client..."
npm run electron-dev

# Clean up: kill webpack dev server when Electron closes
echo "Cleaning up..."
kill $WEBPACK_PID 2> /dev/null

echo "Desktop client closed."
