import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
import { Howl } from "howler";
type PlayPauseButtonProps = {
  isPlaying: boolean;
  play: typeof play;
  pause: typeof pause;
  sound: Howl | undefined;
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  sound,
}: PlayPauseButtonProps) {
  const dispatch = useDispatch();
  const updateProgress = () => {
    if (sound) {
      const progress = (sound.seek() / sound.duration()) * 100;
      dispatch(updateSongProgress(progress));
    }
    console.log(sound);
  };

  let progressInterval: any;
  useEffect(() => {
    if (!sound) return;
    if (isPlaying) {
      sound.play();
      setInterval(updateProgress, 100);
    } else {
      sound.pause();
      setInterval(updateProgress, 100);
    }
  }, [isPlaying, sound]);

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  return (
    <button onClick={handleClick} className="button">
      {isPlaying ? "Pause" : "Play"}
    </button>
  );
}
const mapStateToProps = (state: AppState) => ({
  isPlaying: state.audio.isPlaying,
});

const mapDispatchToProps = {
  play,
  pause,
};

const PlayPauseButtonConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayPauseButton);
export default PlayPauseButtonConnected;
