import React, { useEffect, useRef, useState } from "react";
import testmp3 from "./test.mp3";
import { Provider, useSelector } from "react-redux";
import audioReducer from "./reducers/audio/audio";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AudioPlayer from "./components/audio/AudioPlayer";
import { AppState } from "../types/AppState";

const rootReducer = combineReducers({
  audio: audioReducer,
});
const store = configureStore({
  reducer: rootReducer,
});

function App() {
  const [file, setFile] = useState<File | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files?.[0]);
    }
  };

  return (
    <Provider store={store}>
      <input type="file" onChange={handleChange} />
      <AudioPlayer file={file} />
    </Provider>
  );
}

export default App;
