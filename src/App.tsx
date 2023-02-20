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
const DataContext = createContext<AlbumArtworks>([]);
function App() {
  if (navigator.userAgent.indexOf("Electron") > -1) {
    console.log("Running in an Electron app!");
  } else {
    console.log("Not running in an Electron app.");
  }
  const [data, setData] = useState<Data>({ albumArtworks: [], songs: [] });
  function handleOpenFile() {
    window.electronAPI.showOpenDialog();

    window.electronAPI.on("select-path", (data: Data) => {
      setData((prevData) => ({
        albumArtworks: [
          ...prevData.albumArtworks,
          ...data.albumArtworks.filter((newArtwork) =>
            prevData.albumArtworks.every(
              (existingArtwork) => existingArtwork.album !== newArtwork.album
            )
          ),
        ],
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
      <DataContext.Provider value={data.albumArtworks}>
        <div></div>
        <button onClick={handleOpenFile}>Open</button>

        <AudioPlayer filteredSongs={filtered} />
        <SongMetadata data1={data} />
        <PlaylistMenu />
        <CurrentPlaylist filteredSongs={filtered} />
      </DataContext.Provider>
    </Provider>
  );
}

export default memo(App);
export { DataContext };
