import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
import { Howl } from "howler";
import { setCurrentSong } from "../../../actions/audio/setSong";

type PlayPauseButtonProps = {
  isPlaying: boolean;
  play: typeof play;
  pause: typeof pause;
  audioElement: HTMLAudioElement;
  nextSong: string;
  previousSong: string;
  progress: number;
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  audioElement,
  nextSong,
  previousSong,
  progress,
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
    console.log(nextSong + "ass");
  };
  console.log(progress);
  const handleNext = () => {
    dispatch(setCurrentSong(nextSong));
    console.log(nextSong);
  };
  const handlePrevious = () => {
    if (progress < 10) {
      dispatch(setCurrentSong(previousSong));
    } else {
      dispatch(updateSongProgress(0));
      audioElement.currentTime = 0;
    }
  };
  return (
    <div>
      <button onClick={handlePrevious} className="button">
        {"Previous"}
      </button>
      <button onClick={handleClick} className="button">
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button onClick={handleNext} className="button">
        {"Next"}
      </button>
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  isPlaying: state.audio.isPlaying,
  nextSong: state.audio.nextSong,
  previousSong: state.audio.previousSong,
  progress: state.audio.progress,
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
