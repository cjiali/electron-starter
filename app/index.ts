import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";

// Reference to application window
let mainWindow: BrowserWindow = null;

// Determine whether the command line parameter contains `--debug`
// const debug = /--debug/.test(process.argv[2]);

const createWindow = function () {
  /* 创建应用窗口（并赋值给 mainWindow 变量） */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 应用 Node.js
      //   preload: path.join(__dirname, "preload.js"),
    },
  });

  /**
   * Load index. html file, here load URL is divided into two situations:
   *  1.Development environment, pointing to the development environment address of react
   *  2.Production environment, point to the index html after react build.
   */
  const startUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/window.html"
      : path.join("file://", __dirname, "../build/window.html");
  mainWindow.loadURL(startUrl);
  // mainWindow.loadURL("http://localhost:3000/");
  // mainWindow.loadURL(path.join('file://', __dirname, '/public/index.html'));

  ipcMain.on("min", function () {
    mainWindow.minimize();
  });
  ipcMain.on("max", function () {
    mainWindow.maximize();
  });

  mainWindow.webContents.openDevTools();
  // If the command line contains the `--debug` parameter, open the third-party developer tool
  // if (debug) {
  //    require('devtron').install();
  // }

  mainWindow.on("closed", () => {
    // When the application is closed, release the reference to the main Window variable
    mainWindow = null;
  });
};

// Ensure that the window is only instantiated once
// app.requestSingleInstanceLock();
// app.on('second-instance', () => {
//     if (mainWindow) {
//         if (mainWindow.isMinimized())
//             mainWindow.restore();
//         mainWindow.focus();
//     }
// });

// Listen for app ready events
app.on("ready", () => {
  createWindow();
});

// 监听所有视窗关闭事件
app.on("window-all-closed", () => {
  // On mac OS, unless the user exits definitely with Cmd + Q,
  // Otherwise, most applications and their menu bars will remain active.
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Listen for application activation events
app.on("activate", () => {
  // On mac OS, when the dock icon is clicked and no other windows are open,
  // Usually a window is recreated in the application.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This file can be split into several files and then imported with require.
