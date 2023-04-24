import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import jsmediatags from "jsmediatags";
import glob from "glob";
import fs from "fs";
import { jsmediatagsError, Tags } from "jsmediatags/types";
import { queue } from "async";
import * as mm from "music-metadata";
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
export interface ShortcutTagsNoPics {
  title?: string | undefined;
  artist?: string | undefined;
  album?: string | undefined;
  year?: string | undefined;
  comment?: string | undefined;
  track?: string | undefined;
  genre?: string | undefined;
  duration?: number | undefined;
  lyrics?: string | undefined;
}
const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
    },
  });
  let songs: { filePath: string; songData: ShortcutTagsNoPics }[] = [];
  let albumArtworks = new Map();
  mainWindow.loadURL("http://localhost:3006");
  mainWindow.webContents.openDevTools();

  const sendBatch = (
    ipcEvent: any,
    songsBatch: { filePath: string; songData: ShortcutTagsNoPics }[]
  ) => {
    ipcEvent.reply("select-path", { songs: songsBatch });
  };
  ipcMain.on("dialog:openFile", async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length) {
      const directoryPath = result.filePaths[0];
      const files = glob.sync("**/*.{mp3,flac,m4a}", {
        cwd: directoryPath,
      });

      let songsBatch: { filePath: string; songData: ShortcutTagsNoPics }[] = [];
      let albumArtworks = new Map();
      const batchSize = 200;
      const allowedKeys = [
        "title",
        "artist",
        "album",
        "year",
        "comment",
        "track",
        "genre",
        "duration",
        "lyrics",
      ];

      const filterTags = (
        tags: Record<string, any>,
        duration: number
      ): ShortcutTagsNoPics => {
        const filteredTags: ShortcutTagsNoPics = {};
        allowedKeys.forEach((key) => {
          if (tags.hasOwnProperty(key)) {
            filteredTags[key as keyof ShortcutTagsNoPics] = tags[key] as never;
          }
        });
        // Add the duration directly to the filteredTags object
        filteredTags.duration = duration;
        return filteredTags;
      };

      const processFile = async (filePath: string, callback: any) => {
        try {
          const metadata = await mm.parseFile(
            path.resolve(directoryPath, filePath)
          );
          const duration = metadata.format.duration;

          jsmediatags.read(path.resolve(directoryPath, filePath), {
            onSuccess: (tag) => {
              const album = tag.tags.album;
              const picture = tag.tags.picture;
              const filteredTags = filterTags(tag.tags, duration);
              filteredTags["duration"] = duration;

              const songData: {
                filePath: string;
                songData: ShortcutTagsNoPics;
              } = {
                filePath: path.resolve(directoryPath, filePath),
                songData: filteredTags,
              };

              if (!albumArtworks.has(album) && picture) {
                albumArtworks.set(album, picture);
              }

              callback(null, songData);
            },
            onError: (error) => {
              console.error(error);
              callback(error);
            },
          });
        } catch (error) {
          console.error(error);
          callback(error);
        }
      };
      const fileQueue = queue(processFile, 10);

      fileQueue.drain(() => {
        processAlbumArtworks(albumArtworks);
        if (songsBatch.length > 0) {
          sendBatch(event, songsBatch);
        }
      });

      files.forEach((filePath, index) => {
        fileQueue.push(filePath, (err, songData) => {
          if (err) {
            console.error(err);
          } else {
            songsBatch.push(
              songData as { filePath: string; songData: ShortcutTagsNoPics }
            );

            if (songsBatch.length === batchSize || index === files.length - 1) {
              sendBatch(event, songsBatch);
              songsBatch = [];
            }
          }
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
