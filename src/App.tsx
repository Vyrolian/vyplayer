import React, { createContext, memo, useEffect, useRef, useState } from "react";
import testmp3 from "./test.mp3";
import { Provider, useSelector } from "react-redux";
import audioReducer from "./reducers/audio/audio";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";
import CurrentPlaylist from "./components/playlist/CurrentPlaylist";
import { IElectronAPI } from "./renderer";
import { ShortcutTags, Tags } from "jsmediatags/types";
import { AlbumArtworks, Data, FilteredSongs } from "../types/songMetadata";
import SongMetadata from "./components/audio/audiocomponents/SongMetadata";
import PlaylistMenu from "./components/playlist/menu/PlaylistMenu";
import { useDispatch } from "react-redux";
import { filteredSongs } from "./components/functions/playlist/sorting/filteredSongs";
var jsmediatags = window.jsmediatags;
//console.log(jsmediatags);
const rootReducer = combineReducers({
  audio: audioReducer,
});
const store = configureStore({
  reducer: rootReducer,
});

function App() {
  if (navigator.userAgent.indexOf("Electron") > -1) {
    console.log("Running in an Electron app!");
  } else {
    console.log("Not running in an Electron app.");
  }
  const [data, setData] = useState<Data>({ songs: [] });
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
  let filtered = filteredSongs(data);

  let src = "";

  return (
    <Provider store={store}>
      <div></div>
      <button onClick={handleOpenFile}>Open</button>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "fixed",
            bottom: "23.5%",
            left: "0",
            right: "0",
            height: "10%",
          }}
        >
          {data && <SongMetadata data1={data} />}
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            height: "15%",
          }}
        >
          <AudioPlayer filteredSongs={filtered} />
        </div>
      </div>
      <PlaylistMenu />
      <CurrentPlaylist filteredSongs={filtered} />
    </Provider>
  );
}

export default memo(App);
