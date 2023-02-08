import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { pause, play } from "../../actions/audio/audio";
import { Howl, Howler } from "howler";
import { connect, useSelector } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";
import { Data } from "../../../types/songMetadata";
import { setUseProxies } from "immer";

//import test from "./test.mp3";
type AudioPlayerProps = {
  play: typeof play;
  pause: typeof pause;
  setVolume: typeof setVolume;
  volume: number;
  data: Data;
  currentSong: string;
};

function AudioPlayer({
  data,
  play,
  pause,
  currentSong,
  volume,
}: AudioPlayerProps) {
  const storedVolume = localStorage.getItem("volume");
  let defaultVolume: number;
  if (storedVolume) {
    defaultVolume = parseFloat(storedVolume);
  } else {
    defaultVolume = 0.1;
  }

  const [sound, setSound] = useState<Howl>();
  const [cleared, setCleared] = useState<boolean>();
  console.log(volume);

  useEffect(() => {
    if (sound != undefined) {
      sound.play();
      sound.stop(0);
      sound.unload();
      setSound(undefined);
      pause();
    }
    if (currentSong) {
      const src = `media-loader://${currentSong}`;
      const newSound = new Howl({
        src: [src, src],
        html5: true,

        onload: function () {
          console.log("Sound has loaded!");
        },
      });
      setSound(newSound);
      newSound.volume(defaultVolume);
      play();
      newSound.pause();
      newSound.unload();
    }
  }, [currentSong]);

  return (
    <div className="audio-player">
      <audio id="audio-element" />
      <PlayPauseButton sound={sound} />
      <ProgressBar sound={sound} />
      <VolumeControl defaultValue={defaultVolume} />
    </div>
  );
}

const mapDispatchToProps = { play, pause, setVolume };
function mapStateToProps(state: AppState) {
  return {
    volume: state.audio.volume,
    currentSong: state.audio.currentSong,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
