import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
import { Howl } from "howler";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";

type PlayPauseButtonProps = {
  isPlaying: boolean;
  play: typeof play;
  pause: typeof pause;
  audioElement: HTMLAudioElement;
  nextSong: string;
  previousSong: string;
  currentSong: string;
  progress: number;
  currentSongIndex: number;
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  audioElement,
  nextSong,
  previousSong,
  currentSong,
  progress,
  currentSongIndex,
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
    console.log(nextSong);
  };
  //console.log(progress);
  const handleNext = () => {
    dispatch(setCurrentSong(nextSong));
    dispatch(setCurrentSongIndex(currentSongIndex + 1));
    console.log(nextSong);
  };
  if (audioElement)
    audioElement.onended = () => {
      console.log(nextSong);
      dispatch(setCurrentSong(nextSong));
      dispatch(setCurrentSongIndex(currentSongIndex + 1));
    };
  const handlePrevious = () => {
    if (progress < 10 && currentSong != previousSong) {
      dispatch(setCurrentSong(previousSong));
      dispatch(setCurrentSongIndex(currentSongIndex - 1));
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
  currentSong: state.audio.currentSong,
  progress: state.audio.progress,
  currentSongIndex: state.audio.currentSongIndex,
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
