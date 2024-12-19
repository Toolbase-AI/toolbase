import { join } from 'node:path';
import { app, BrowserWindow, shell } from 'electron';
import started from 'electron-squirrel-startup';
import { setupIPCListeners } from './ipc-listeners';
import { copyLocalRunnerToSettings } from './runner-utils';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 320,
    minHeight: 400,
    webPreferences: {
      preload: join(import.meta.dirname, 'preload.js'),
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Prevent links to be opened in the current browser, open in the OS default browser
    shell.openExternal(url).catch(() => {
      // Empty
    });
    return { action: 'deny' };
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL).catch(() => {});
  } else {
    mainWindow
      .loadFile(
        join(
          import.meta.dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
        ),
      )
      .catch(() => {});
  }

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  setupIPCListeners();

  // Tries to copy over local runner on open.
  copyLocalRunnerToSettings().catch(() => {});

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
