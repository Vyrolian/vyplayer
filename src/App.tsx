import React, { useEffect, useRef, useState } from "react";
import testmp3 from "./test.mp3";
import { Provider, useSelector } from "react-redux";
import audioReducer from "./reducers/audio/audio";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";
import Playlist from "./components/playlist/Playlist";
import { IElectronAPI } from "./renderer";
import { Tags } from "jsmediatags/types";
const rootReducer = combineReducers({
  audio: audioReducer,
});
const store = configureStore({
  reducer: rootReducer,
});
const handleSelectFiles = () => {
  // ipcRenderer.send("select-files");
};
type Data = {
  filePaths: string[];
  songs: Tags;
};
function App() {
  if (navigator.userAgent.indexOf("Electron") > -1) {
    console.log("Running in an Electron app!");
  } else {
    console.log("Not running in an Electron app.");
  }
  const [data, setData] = useState<Data>({ filePaths: [], songs: {} });

  const [file1, setFile1] = useState<File | null>(null);

  function handleOpenFile() {
    window.electronAPI.showOpenDialog();
    window.electronAPI.on("on-file-select", (data: any) => {
      const blob = new Blob([data]);
      const file = new File([blob], "audio.mp3");
      setFile1(file);
    });

    window.electronAPI.on("select-path", (data: Data) => {
      setData(data);
    });
  }
  let src = "";

  return (
    <Provider store={store}>
      <button onClick={handleOpenFile}>ass</button>

      <AudioPlayer file={file1} />
      <Playlist data={data} />
    </Provider>
  );
}

export default App;
