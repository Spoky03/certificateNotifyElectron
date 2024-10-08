import { app, BrowserWindow, ipcMain, protocol, IpcMain } from "electron";
import { exec } from "child_process";
import axios from "axios";
import SimpleElectronStore from "./store";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle('request', async (_, axios_request) => {
  const result = await axios(axios_request)
  return { data: result.data, status: result.status }
})
//get user email from os store
ipcMain.handle('get-user-email', async () => {
  // return new Promise((resolve, reject) => {
  //   exec('powershell "Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty UserName"', (error, stdout, stderr) => {
  //     if (error) {
  //       reject(`Error: ${error.message}`);
  //     } else if (stderr) {
  //       reject(`stderr: ${stderr}`);
  //     } else {
  //       resolve(stdout);
  //     }
  //   });
  // });
  // use store to get user email
  const store = new SimpleElectronStore();
  return store.get("email");
});
//set user email to os store
ipcMain.handle('set-user-email', async (_, email) => {
  const store = new SimpleElectronStore();
  store.set("email", email);
  // save
  store.save();
  console.log("email set to: ", email);
  return email;
});
// Function to fetch certificates using PowerShell
ipcMain.handle("get-certificates", async () => {
  return new Promise((resolve, reject) => {
    exec(
      'powershell "Get-ChildItem -Path Cert:\\LocalMachine\\My, Cert:\\LocalMachine\\CA, Cert:\\LocalMachine\\Root | Format-List"',
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        } else if (stderr) {
          reject(`stderr: ${stderr}`);
        } else {
          resolve(stdout);
        }
      }
    );
  });
});

