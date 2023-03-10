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
import { Tags, TagType, PictureType } from "jsmediatags/types";
import { Howl, Howler } from "howler";
import fastGlob from "fast-glob";
import glob from "glob";
interface SongData extends TagType {
  filePath: string;
}
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

  ipcMain.on("dialog:openFile", async (event) => {
    let songs: Array<{
      filePath: string;
      songData: {
        title?: string;
        artist?: string;
        album?: string;
        year?: string;
        comment?: string;
        track?: string;
        genre?: string;
      };
    }> = [];
    const albumArtworks: Array<{ album: string; picture: PictureType }> = [];
    const albumPicturesMap = new Map<string, PictureType>();
    let filesProcessed = 0;
    let chunkSize = 50; // number of files to process in one chunk
    let firstSongOfAlbum = true; // flag to track first song of album

    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length) {
      const directoryPath = result.filePaths[0];

      // Use glob to search for files in the directory
      const files = glob.sync("**/*.{mp3,flac,m4a}", {
        cwd: directoryPath,
      });

      let chunk = [];
      for (let i = 0; i < files.length; i++) {
        chunk.push(files[i]);
        if (i % chunkSize === chunkSize - 1 || i === files.length - 1) {
          processChunk(chunk, files.length, directoryPath);
          chunk = [];
        }
      }
    }

    function processChunk(
      chunk: string[],
      totalFiles: number,
      directoryPath: string
    ) {
      chunk.forEach((filePath: string) => {
        jsmediatags.read(path.resolve(directoryPath, filePath), {
          onSuccess: (tag) => {
            const album = tag.tags.album;
            const picture = tag.tags.picture;
            if (!albumPicturesMap.has(album)) {
              albumPicturesMap.set(album, picture);
              albumArtworks.push({ album, picture });
            }

            const songData = {
              title: tag.tags.title,
              artist: tag.tags.artist,
              album: tag.tags.album,
              year: tag.tags.year,
              comment: tag.tags.comment,
              track: tag.tags.track,
              genre: tag.tags.genre,
            };

            // Loop through the album artworks and add each unique image to the set

            songs.push({
              filePath: path.resolve(directoryPath, filePath),
              songData,
            });

            filesProcessed++;
            if (filesProcessed === totalFiles) {
              const uniquePictures = new Set();
              albumArtworks.forEach((artwork) => {
                if (artwork?.picture !== undefined) {
                  const { data, format } = artwork.picture;
                  const base64String = Buffer.from(data).toString("base64");

                  // Check if the image is already in the set
                  if (!uniquePictures.has(artwork.album)) {
                    uniquePictures.add(artwork.album);

                    // Construct the filename using the album name
                    const albumName = artwork.album.replace(
                      /[<>:"\/\\|?*\x00-\x1F]/g,
                      "_"
                    );
                    const fileName = `${albumName}.jpeg`;
                    const filePath = `C:/test/${fileName}`;
                    // Check if the file already exists
                    if (fs.existsSync(filePath)) {
                      console.log(
                        `Album artwork picture already exists: ${fileName}`
                      );
                    } else {
                      // Write the image data to a file
                      const dirPath = path.dirname(filePath);
                      if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, { recursive: true });
                      }
                      fs.writeFile(
                        `C:/test/${fileName}`,
                        base64String,
                        "base64",
                        (err) => {
                          if (err) {
                            console.error(err);
                          } else {
                            console.log(
                              `Saved album artwork picture: ${fileName}`
                            );
                          }
                        }
                      );
                    }
                  }
                }
              });
              songs.sort(
                (a, b) =>
                  parseInt(a.songData.track) - parseInt(b.songData.track)
              );
              console.log(albumArtworks);
              event.reply("select-path", {
                songs,
              });
            }
          },

          onError: (error) => {
            console.error(error);
            filesProcessed++;
          },
        });
      });
    }
  });
  ipcMain.on("path-selected", (event, path) => {
    console.log(path + "123");
  });

  app.whenReady().then(() => {
    // Create custom protocol for local media loading
    protocol.registerFileProtocol("media-loader", (request, callback) => {
      const url = request.url.replace("media-loader://", "");

      try {
        return callback(url);
      } catch (err) {
        return console.log("ass");
      }
    });
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
