import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogOptions,
  protocol,
} from "electron";
import fs, { createReadStream } from "fs";
import http from "http";
import url from "url";
import path, { join } from "path";
import jsmediatags from "jsmediatags";
import { Tags } from "jsmediatags/types";
import { Howl, Howler } from "howler";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const audioExtensions = [".mp3", ".wav", ".aac", ".ogg"];
ipcMain.on("select-files", (event) => {
  const options: Electron.OpenDialogOptions = {
    properties: ["openFile", "multiSelections"],
  };
  dialog.showOpenDialog(options).then((result) => {
    if (result.canceled) return;
    event.sender.send("selected-files", result.filePaths);
  });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,

      nodeIntegration: false,
    },
  });
  /*ipcMain.handle("dialog:openFile", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile", "multiSelections"],
    });
    event.sender.send("dialog:openFile:result", result);
  });*/
  /* ipcMain.on("dialog:openFile", () => {
    dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
  }); */
  let songs: { songData: Tags }[] = [];
  let filesProcessed = 0;
  ipcMain.on("dialog:openFile", (event) => {
    songs = [];
    filesProcessed = 0;

    dialog
      .showOpenDialog(mainWindow!, {
        properties: ["openDirectory"],
      })
      .then(({ filePaths }) => {
        if (filePaths.length) {
          const directoryPath = filePaths[0];
          fs.readdir(directoryPath, (err, files) => {
            if (err) {
              console.error(err);
              return;
            }
            const filePaths = files.map((file) =>
              path.join(directoryPath, file)
            );

            const song = filePaths[0];
            console.log(song + "asswecan");

            // set the first song as the source

            // play the first song

            console.log(filePaths);
            filePaths.forEach((filePath) => {
              jsmediatags.read(filePath, {
                onSuccess: (tag) => {
                  songs.push({
                    songData: tag.tags,
                  });
                  songs.sort(
                    (a, b) =>
                      parseInt(a.songData.track) - parseInt(b.songData.track)
                  );

                  console.log(tag.tags.title);
                  filesProcessed++;
                  if (filesProcessed === filePaths.length) {
                    event.reply("select-path", {
                      songs: songs,
                      filePaths: filePaths,
                    });
                  }
                },
                onError: (error: any) => {
                  console.error(error);
                  filesProcessed++;
                },
              });
            });
          });
        }
      });
  });

  ipcMain.on("path-selected", (event, path) => {
    console.log(path + "123");
    const chunkSize = 1024 * 1024; // 1 MB in bytes
    let currentChunk = 0;
    let stream = fs.createReadStream(path, {
      start: currentChunk,
      end: chunkSize - 1,
    });

    stream.on("data", (chunk) => {
      event.reply("on-file-select", chunk);
      currentChunk += chunkSize;
      stream = fs.createReadStream(path, {
        start: currentChunk,
        end: currentChunk + chunkSize - 1,
      });
    });
  });

  app.whenReady().then(() => {
    protocol.registerFileProtocol("myapp", (request, callback) => {
      const url = request.url.substr(7);
      callback({ path: path.normalize(`C:/Download/Musec/${url}`) });
    });
  });
  fs.readdir("myapp:///", (err, files) => {
    if (err) {
      console.error(err);
    } else {
      console.log(files);
    }
  });
  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3006");

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
