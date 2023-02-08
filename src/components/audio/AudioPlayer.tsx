import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { play } from "../../actions/audio/audio";
import Howler, { Howl } from "howler";
import { connect } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";
import test from "./test.mp3";
type AudioPlayerProps = {
  file: Blob | null;
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
    if (file) {
      const streamUrl = URL.createObjectURL(file);
      console.log(streamUrl + "assdick");
      const sound = new Howl({
        src: [test],
        html5: true,
        autoplay: true,
        onload: function () {
          console.log("Sound has loaded!");
        },
      });
      sound.volume(defaultVolume);
      sound.play();
      play();
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
