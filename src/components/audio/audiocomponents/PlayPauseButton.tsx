import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
type PlayPauseButtonProps = {
  isPlaying: boolean;
  play: typeof play;
  pause: typeof pause;
  audioElement: HTMLAudioElement;
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  audioElement,
}: PlayPauseButtonProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }

    const updateProgress = () => {
      const progress = (audioElement.currentTime / audioElement.duration) * 100;

      dispatch(updateSongProgress(progress));
    };
    audioElement.addEventListener("timeupdate", updateProgress);
    return () => audioElement.removeEventListener("timeupdate", updateProgress);
  }, [isPlaying, dispatch, audioElement]);

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
