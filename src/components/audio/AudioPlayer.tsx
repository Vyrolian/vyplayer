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
import { set } from "immer/dist/internal";

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
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  var durationUpdater;
  useEffect(() => {
    if (currentSong) {
      audioElement.src = `media-loader://C:test.flac`;
      audioElement.volume = defaultVolume;
      audioElement.play();
      console.log(audioElement);
      const newSound = new Howl({
        src: [``],
        html5: true,
        onplay: function () {},
      });
      if (sound) {
        sound.play();
        sound.stop();
        sound.unload();
      }
      setSound(newSound);

      play();
    } else {
      setSound(undefined);
    }
    sound?.unload();
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
