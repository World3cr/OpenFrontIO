# OpenFrontIO Desktop Client

## Overview

This is the standalone desktop version of OpenFrontIO, built with Electron. It provides a native application experience without requiring a web browser.

## Features

- **Native Desktop App**: Runs as a standalone executable
- **Full Game Experience**: Complete OpenFrontIO gameplay
- **Better Performance**: Optimized for desktop usage
- **Offline Capable**: Can run without browser dependencies
- **Cross-Platform**: Available for Windows, macOS, and Linux

## Quick Start

### For Users

#### Windows

1. **Run Development Version**: Double-click `start-desktop-dev.bat`
2. **Build Executable**: Double-click `build-desktop.bat`

#### All Platforms

```bash
# Development mode
npm run electron-dev

# Build production executable
npm run build-desktop
```

### For Developers

#### Development Commands

```bash
# Start with webpack dev server + electron
npm run electron-dev

# Build production version
npm run build-prod
npm run build-desktop

# Build for all platforms
npm run build-desktop-all
```

## Architecture

### Main Process (`electron-main.cjs`)

- Window management
- Menu system
- IPC (Inter-Process Communication) handlers
- Security policies

### Renderer Process

- The web-based OpenFrontIO client
- Enhanced with desktop-specific features via preload script

### Preload Script (`electron-preload.cjs`)

- Secure bridge between main and renderer processes
- Desktop-specific functionality
- Platform integration

## Desktop-Specific Features

### Game Controls

- **Ctrl+N**: New Game
- **Ctrl+J**: Join Public Game
- **F11**: Toggle Fullscreen
- **F12**: Toggle Developer Tools
- **Ctrl+R**: Reload Game

### Window Management

- Minimize/Maximize/Close controls
- Resizable game window
- Remember window state

### Enhanced Security

- Sandboxed renderer process
- Secure IPC communication
- External link protection

## File Structure

```
├── electron-main.cjs           # Main Electron process
├── electron-preload.cjs        # Preload script for security
├── start-desktop-dev.bat       # Windows development launcher
├── build-desktop.bat           # Windows build script
├── static/                     # Built web application
└── dist/                       # Built desktop executables
```

## Build Outputs

After running `npm run build-desktop`, you'll find:

### Windows

- `OpenFrontIO-Setup-[version].exe` - Installer
- `OpenFrontIO-[version]-x64.exe` - Portable executable

### macOS

- `OpenFrontIO-[version]-x64.dmg` - DMG installer

### Linux

- `OpenFrontIO-[version]-x64.AppImage` - AppImage
- `OpenFrontIO-[version]-amd64.deb` - Debian package

## Development

### Prerequisites

- Node.js 24.3.0+
- npm 11.4.2+

### Setup

1. Install dependencies: `npm install`
2. Start development: `npm run electron-dev`

### Testing

- Use `npm run electron-dev` for development with hot reload
- The app will connect to `localhost:8080` for the webpack dev server
- Enable DevTools with F12 for debugging

## Customization

### App Icon

- Windows: `resources/images/Favicon.ico`
- macOS: `resources/images/Favicon.icns` (needs to be created)
- Linux: `resources/images/Favicon.png`

### Build Configuration

Edit the `build` section in `package.json` to customize:

- App metadata
- Build targets
- Installer options
- Code signing (for distribution)

## Distribution

### Code Signing (Production)

For production distribution, you'll need to configure code signing:

- Windows: Authenticode certificate
- macOS: Apple Developer certificate
- Linux: GPG signing (optional)

### Auto-Updates

The app is configured for electron-builder's auto-updater. To enable:

1. Set up a release server
2. Configure the `publish` option in package.json
3. Implement update checking in the main process

## Troubleshooting

### Common Issues

1. **App won't start**: Check that Node.js is installed
2. **Build fails**: Ensure all dependencies are installed (`npm install`)
3. **Icon not showing**: Verify icon file exists and paths are correct
4. **Connection issues**: Check that webpack dev server is running (development mode)

### Development Debugging

- Use `npm run electron-dev` to see console output
- Enable DevTools with F12
- Check the main process logs in terminal

## Security Notes

- The app uses Electron's security best practices
- Node.js integration is disabled in renderer
- Context isolation is enabled
- External links open in default browser
- All IPC communication is validated

This desktop client provides the full OpenFrontIO experience in a native application package!
