import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { play } from "../../actions/audio/audio";

import { connect } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";

type AudioPlayerProps = {
  file: File | null;
  play: typeof play;
  setVolume: typeof setVolume;
  volume: number;
};

function AudioPlayer({ file, play, volume }: AudioPlayerProps) {
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

  useEffect(() => {
    if (!audioElement) return;
    if (file) {
      audioElement.src = URL.createObjectURL(file);
      audioElement.volume = defaultVolume;
      audioElement.play();
      play();
    } else {
      audioElement.src = ""; // Set the src to an empty string
    }
  }, [file]);

  return (
    <div className="audio-player">
      <audio id="audio-element" />
      <PlayPauseButton audioElement={audioElement} />
      <ProgressBar />
      <VolumeControl defaultValue={defaultVolume} />
      <SongMetadata file={file} />
    </div>
  );
}

const mapDispatchToProps = { play, setVolume };
function mapStateToProps(state: AppState) {
  return {
    volume: state.audio.volume,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
