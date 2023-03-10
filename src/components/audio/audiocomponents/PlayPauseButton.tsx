import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause, shuffle, next } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
import { ReactComponent as PlayIcon } from "../../../icons/Play.svg";
import { ReactComponent as PreviousIcon } from "../../../icons/Previous.svg";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setNextSong,
  setNextSongIndex,
} from "../../../actions/audio/setSong";

// import { progress } from "../../../constants/audio/audioProgress";

type PlayPauseButtonProps = {
  isPlaying: boolean;
  play: typeof play;
  pause: typeof pause;
  shuffle: typeof shuffle;
  next: typeof next;
  audioElement: HTMLAudioElement;
  nextSong: string;
  previousSong: string;
  currentSong: string;
  storeProgress: number;
  currentSongIndex: number;
  isShuffled: boolean;
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  next,
  shuffle,
  audioElement,
  isShuffled,
  nextSong,
  previousSong,
  currentSong,
  storeProgress,
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
    if (isShuffled) dispatch(setNextSongIndex(1));
    const updateProgress = () => {
      const progress =
        (audioElement?.currentTime / audioElement?.duration) * 100;
      dispatch(updateSongProgress(progress));
    };
    console.log("ASSSSS", isShuffled);
    audioElement.addEventListener("timeupdate", updateProgress);
    return () => audioElement.removeEventListener("timeupdate", updateProgress);
  }, [isPlaying, dispatch, audioElement, isShuffled]);
  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // console.log(isPlaying);
  //console.log(progress);

  if (audioElement)
    audioElement.onended = () => {
      console.log(nextSong);
      dispatch(setCurrentSongIndex(currentSongIndex + 1));
      dispatch(setCurrentSong(nextSong));
    };
  const handlePrevious = () => {
    if (storeProgress < 10 && currentSong != previousSong) {
      dispatch(setCurrentSong(previousSong));
      dispatch(setCurrentSongIndex(currentSongIndex - 1));
    } else {
      dispatch(updateSongProgress(0));
      audioElement.currentTime = 0;
    }
  };
  const handleNext = () => {
    next();
    dispatch(setCurrentSong(nextSong));
  };
  const handleShuffle = () => {
    shuffle();
  };
  return (
    <div className="playpausebutton-container">
      <button onClick={handlePrevious} className="playpausebutton">
        {<PreviousIcon />}
      </button>
      <div className="playpausebutton-ellipse">
        <button onClick={handleClick} className="playpausebutton">
          {isPlaying ? (
            <PlayIcon className="play-icon" width="24" height="24" />
          ) : (
            "Pause"
          )}
        </button>
      </div>
      <button onClick={handleNext} className="button">
        {"Next"}
      </button>
      <button onClick={handleShuffle} className="button">
        {"Shuffle"}
      </button>
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  isPlaying: state.audio.isPlaying,
  nextSong: state.audio.nextSong,
  previousSong: state.audio.previousSong,
  currentSong: state.audio.currentSong,
  storeProgress: state.audio.progress,
  currentSongIndex: state.audio.currentSongIndex,
  isShuffled: state.audio.isShuffled,
});

const mapDispatchToProps = {
  play,
  pause,
  next,
  shuffle,
};

const PlayPauseButtonConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayPauseButton);
export default PlayPauseButtonConnected;
