const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App control
  minimize: () => ipcRenderer.invoke("app:minimize"),
  maximize: () => ipcRenderer.invoke("app:maximize"),
  close: () => ipcRenderer.invoke("app:close"),

  // Game specific functions
  newGame: () => ipcRenderer.invoke("game:new"),
  joinGame: () => ipcRenderer.invoke("game:join"),

  // Settings
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (settings) => ipcRenderer.invoke("settings:set", settings),

  // Platform info
  platform: process.platform,

  // Version info
  getVersion: () => ipcRenderer.invoke("app:version"),
});

// Add desktop-specific styling when the page loads
window.addEventListener("DOMContentLoaded", () => {
  // Add a class to identify this as the desktop version
  document.body.classList.add("desktop-app");

  // Add some desktop-specific CSS
  const style = document.createElement("style");
  style.textContent = `
    .desktop-app {
      user-select: none; /* Disable text selection for more app-like feel */
      -webkit-app-region: no-drag; /* Allow interaction with all elements */
    }
    
    /* Optional: Custom title bar styling if you implement one */
    .desktop-titlebar {
      -webkit-app-region: drag;
      background: #2d2d2d;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      color: white;
      font-size: 14px;
    }
    
    .desktop-titlebar .controls {
      -webkit-app-region: no-drag;
    }
    
    /* Make the game canvas non-draggable */
    canvas {
      -webkit-app-region: no-drag;
    }
    
    /* Ensure all interactive elements are non-draggable */
    button, input, select, textarea {
      -webkit-app-region: no-drag;
    }
  `;
  document.head.appendChild(style);
});

// Handle external links in desktop mode
window.addEventListener("click", (e) => {
  const target = e.target.closest("a");
  if (target && target.href && target.href.startsWith("http")) {
    e.preventDefault();
    // This will be handled by the main process to open in default browser
  }
});
