import React, { useEffect, useRef, useState } from "react";
import testmp3 from "./test.mp3";
import { Provider, useSelector } from "react-redux";
import audioReducer from "./reducers/audio/audio";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";
import Playlist from "./components/playlist/Playlist";

const electron = window.require("electron");
const ipcRenderer = window.require("electron");
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

  const handleSelectFiles = () => {
    ipcRenderer.send("dialog");
  };

  const [file, setFile] = useState<File | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files?.[0]);
    }
  };

  return (
    <Provider store={store}>
      <input type="file" onChange={handleSelectFiles} />
      <AudioPlayer file={file} />
      <Playlist />
    </Provider>
  );
}

export default App;
