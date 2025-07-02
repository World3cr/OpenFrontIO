const {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  ipcMain,
} = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, "resources/images/Favicon.ico"), // You'll need to convert the SVG to ICO
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "electron-preload.js"),
    },
    show: false, // Don't show until ready
    autoHideMenuBar: false,
    titleBarStyle: "default",
  });

  // Load the app
  if (isDev) {
    // Development: load from webpack dev server
    mainWindow.loadURL("http://localhost:8080");
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built static files
    mainWindow.loadFile(path.join(__dirname, "static/index.html"));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Focus the window
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Prevent navigation to external sites
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== "http://localhost:8080" && !isDev) {
      event.preventDefault();
    }
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          },
        },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Fullscreen",
          accelerator: "F11",
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: "Game",
      submenu: [
        {
          label: "New Game",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            // Send message to renderer to start new game
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                // Trigger new game in the web app
                document.getElementById('single-player')?.click();
              `);
            }
          },
        },
        {
          label: "Join Public Game",
          accelerator: "CmdOrCtrl+J",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                // Focus on public lobby
                document.querySelector('public-lobby')?.scrollIntoView();
              `);
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About OpenFrontIO",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About OpenFrontIO",
              message: "OpenFrontIO",
              detail:
                "A real-time strategy game focused on territorial control and alliance building.\n\nDesktop Client Version 1.0.0",
              buttons: ["OK"],
            });
          },
        },
        {
          label: "Learn More",
          click: () => {
            shell.openExternal("https://github.com/openfrontio/OpenFrontIO");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event listeners
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on("activate", () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle certificate errors
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    if (isDev) {
      // In development, ignore certificate errors for localhost
      event.preventDefault();
      callback(true);
    } else {
      // In production, use default behavior
      callback(false);
    }
  },
);

// IPC Handlers for enhanced desktop functionality
ipcMain.handle("app:minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("app:maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("app:close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("app:version", () => {
  return app.getVersion();
});

ipcMain.handle("game:new", () => {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      document.getElementById('single-player')?.click();
    `);
  }
});

ipcMain.handle("game:join", () => {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      document.querySelector('public-lobby')?.scrollIntoView();
    `);
  }
});

// Settings management (you can extend this)
let appSettings = {
  theme: "dark",
  fullscreen: false,
};

ipcMain.handle("settings:get", () => {
  return appSettings;
});

ipcMain.handle("settings:set", (event, newSettings) => {
  appSettings = { ...appSettings, ...newSettings };
  return appSettings;
});
