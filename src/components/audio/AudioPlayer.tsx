import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { pause, play } from "../../actions/audio/audio";

import { connect, useDispatch, useSelector } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";
import { Data } from "../../../types/songMetadata";
import { setUseProxies } from "immer";
import { set } from "immer/dist/internal";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setNextSong,
  setPreviousSong,
} from "../../actions/audio/setSong";

//import test from "./test.mp3";
type AudioPlayerProps = {
  play: typeof play;
  pause: typeof pause;
  setVolume: typeof setVolume;
  data: Data;
  currentSong: string;
  currentSongIndex: number;
};

function AudioPlayer({
  data,
  play,
  pause,
  currentSong,
  currentSongIndex,
}: AudioPlayerProps) {
  const storedVolume = localStorage.getItem("volume");
  let defaultVolume: number;
  if (storedVolume) {
    defaultVolume = parseFloat(storedVolume);
  } else {
    defaultVolume = 0.1;
  }
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!audioElement) return;
    if (currentSong) {
      audioElement.src = `media-loader://${currentSong}`;
      audioElement.volume = defaultVolume;
      audioElement.play();

      let previousSongIndex = currentSongIndex - 1;
      let nextSongIndex = currentSongIndex + 1;

      //  dispatch(setCurrentSongIndex(currentSongIndex + 1));

      if (nextSongIndex >= data.songs.length) {
        nextSongIndex = 0;
        dispatch(setCurrentSongIndex(0));
      }
      if (currentSongIndex == 0) {
        previousSongIndex = 0;
      }

      console.log(
        previousSongIndex +
          " - Previous Index " +
          currentSongIndex +
          " - Current Index " +
          nextSongIndex +
          " - Next Index "
      );
      if (previousSongIndex >= 0 && previousSongIndex < data.songs.length) {
        dispatch(setPreviousSong(data.songs[previousSongIndex].filePath));
        dispatch(setNextSong(data.songs[nextSongIndex].filePath));
      }

      play();
    } else {
      audioElement.src = ""; // Set the src to an empty string
    }
  }, [currentSong]);
  return (
    <div className="audio-player">
      <audio id="audio-element" />
      <PlayPauseButton audioElement={audioElement} />
      <ProgressBar />
      <VolumeControl defaultValue={defaultVolume} />
    </div>
  );
}

const mapDispatchToProps = { play, pause, setVolume };
function mapStateToProps(state: AppState) {
  return {
    nextSong: state.audio.nextSong,
    volume: state.audio.volume,
    currentSong: state.audio.currentSong,
    currentSongIndex: state.audio.currentSongIndex,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
