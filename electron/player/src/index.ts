import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import jsmediatags from "jsmediatags";
import glob from "glob";
import fs from "fs";
import { Tags } from "jsmediatags/types";

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3006");
  mainWindow.webContents.openDevTools();

  ipcMain.on("dialog:openFile", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length) {
      const directoryPath = result.filePaths[0];
      const files = glob.sync("**/*.{mp3,flac,m4a}", {
        cwd: directoryPath,
      });

      let songs: { filePath: string; songData: Tags }[] = [];
      let albumArtworks = new Map();

      files.forEach((filePath, index) => {
        jsmediatags.read(path.resolve(directoryPath, filePath), {
          onSuccess: (tag) => {
            const album = tag.tags.album;
            const picture = tag.tags.picture;
            const songData = {
              filePath: path.resolve(directoryPath, filePath),
              songData: tag.tags,
            };

            songs.push(songData);

            if (!albumArtworks.has(album) && picture) {
              albumArtworks.set(album, picture);
            }

            if (index === files.length - 1) {
              processAlbumArtworks(albumArtworks);
              event.reply("select-path", { songs });
            }
          },
          onError: (error) => {
            console.error(error);
          },
        });
      });
    }
  });

  const processAlbumArtworks = (albumArtworks: any[] | Map<any, any>) => {
    albumArtworks.forEach((picture, album) => {
      const { data, format } = picture;
      const base64String = Buffer.from(data).toString("base64");
      const albumName = album.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_");
      const fileName = `${albumName}.jpeg`;
      const filePath = `C:/test/${fileName}`;

      if (!fs.existsSync(filePath)) {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFile(filePath, base64String, "base64", (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved album artwork picture: ${fileName}`);
          }
        });
      }
    });
  };
};

app.whenReady().then(() => {
  // Create custom protocol for local media loading
  protocol.registerFileProtocol("media-loader", (request, callback) => {
    const url = request.url.replace("media-loader://", "");
    const decodedUrl = decodeURIComponent(url);

    try {
      return callback(decodedUrl);
    } catch (err) {
      console.error(err);
    }
  });
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
