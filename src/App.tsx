import React, { useEffect, useRef, useState } from "react";
import testmp3 from "./test.mp3";
import { Provider, useSelector } from "react-redux";
import audioReducer from "./reducers/audio/audio";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";
import Playlist from "./components/playlist/Playlist";
import { IElectronAPI } from "./renderer";
import { ShortcutTags, Tags } from "jsmediatags/types";
import { Data } from "../types/songMetadata";
import SongMetadata from "./components/audio/audiocomponents/SongMetadata";
const rootReducer = combineReducers({
  audio: audioReducer,
});
const store = configureStore({
  reducer: rootReducer,
});
const handleSelectFiles = () => {
  // ipcRenderer.send("select-files");
};

function App() {
  if (navigator.userAgent.indexOf("Electron") > -1) {
    console.log("Running in an Electron app!");
  } else {
    console.log("Not running in an Electron app.");
  }
  const [data, setData] = useState<Data>({ albumArtworks: [], songs: [] });

  const [file1, setFile1] = useState<Blob | null>(null);

  function handleOpenFile() {
    window.electronAPI.showOpenDialog();
    window.electronAPI.on("on-file-select", (data: any) => {
      // console.log(data);
    });

    window.electronAPI.on("select-path", (data: Data) => {
      setData(data);
    });
  }
  let src = "";

  return (
    <Provider store={store}>
      <button onClick={handleOpenFile}>Open</button>

      <AudioPlayer data={data} />
      <SongMetadata data1={data} />
      <Playlist data={data} />
    </Provider>
  );
}

export default App;
