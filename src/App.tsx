import React, { createContext, memo, useEffect, useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";

import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";
import CurrentPlaylist from "./components/playlist/CurrentPlaylist";
import { AlbumArtworks, Data, FilteredSongs } from "../types/songMetadata";
import SongMetadata from "./components/audio/audiocomponents/SongMetadata";
import PlaylistMenu from "./components/playlist/menu/PlaylistMenu";
import { filteredSongs } from "./components/functions/playlist/sorting/filteredSongs";
import "./App.css";
import localForage from "localforage";
import "./custom-fonts.css";
var jsmediatags = window.jsmediatags;

//console.log(jsmediatags);

function App() {
  const playlists = useSelector((state: AppState) => state.audio.playlists);
  // console.log("P L A Y L I S T S ", playlists);
  if (navigator.userAgent.indexOf("Electron") > -1) {
    console.log("Running in an Electron app!");
  } else {
    console.log("Not running in an Electron app.");
  }
  const [data, setData] = useState<Data>({ songs: [] });
  /* useEffect(() => {
    localForage.getItem("songs").then((storedSongs) => {
      if (storedSongs) {
        setData({ songs: storedSongs as any[] });
      }
    });

  }, []);*/
  localForage.clear();
  function handleOpenFile() {
    window.electronAPI.showOpenDialog();

    window.electronAPI.on("select-path", (data: Data) => {
      setData((prevData) => ({
        songs: [
          ...prevData.songs,
          ...data.songs
            .filter((newSong) =>
              prevData.songs.every(
                (existingSong) =>
                  existingSong.songData.title !== newSong.songData.title
              )
            )
            .map((song) => ({
              ...song,
              playlists: song.playlists ? song.playlists : ["Library"], // set default playlist if no playlists are present
            })),
        ],
      }));
    });
  }
  useEffect(() => {
    setData(({ songs }) => ({
      songs: songs.map((song) => ({
        ...song,
        playlists: song.playlists.filter((playlist) =>
          playlists.some((storePlaylist) => storePlaylist.id === playlist)
        ),
      })),
    }));
  }, []);
  // localForage.clear();
  let filtered = filteredSongs(data);

  localForage.setItem("songs", data.songs);

  let src = "";

  return (
    <div>
      <div className="container">
        <div className="left-fixed">
          <div className="open-folder">
            <button onClick={handleOpenFile}>Open Folder</button>
          </div>

          <PlaylistMenu />
        </div>
        <div className="main-content">
          <CurrentPlaylist filteredSongs={filtered} />
        </div>
      </div>
      <div className="bottom-fixed ">
        <div>
          <AudioPlayer filteredSongs={filtered} />
        </div>
      </div>
    </div>
  );
}

export default memo(App);
