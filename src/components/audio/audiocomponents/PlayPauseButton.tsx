import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { play, pause, shuffle, next } from "../../../actions/audio/audio";
import "./PlayPauseButton.css";
import { updateSongProgress } from "../../../actions/audio/updateSongProgress";
import { ReactComponent as PlayIcon } from "../../../icons/Play.svg";
import { ReactComponent as PauseIcon } from "../../../icons/Pause.svg";
import { ReactComponent as PreviousIcon } from "../../../icons/Previous.svg";
import { ReactComponent as ShuffleIcon } from "../../../icons/Shuffle.svg";
import { ReactComponent as RepeatIcon } from "../../../icons/Repeat.svg";
import { ReactComponent as NextIcon } from "../../../icons/Next.svg";
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
  audioElement: React.RefObject<HTMLAudioElement>;
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
    if (!audioElement.current) return;
    if (isPlaying) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
    // if (isShuffled) dispatch(setNextSongIndex(1));
    const updateProgress = () => {
      if (!audioElement.current) return;
      const progress =
        (audioElement.current.currentTime / audioElement.current.duration) *
        100;
      dispatch(updateSongProgress(progress));
    };
    console.log("ASSSSS", isShuffled);
    audioElement.current.addEventListener("timeupdate", updateProgress);
    return () => {
      if (audioElement.current) {
        audioElement.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [isPlaying, dispatch, audioElement, isShuffled]);
  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  const [repeatOne, setRepeatOne] = useState(false);
  // console.log(isPlaying);
  //console.log(progress);
  const handleRepeatOne = () => {
    setRepeatOne((prevRepeatOne) => !prevRepeatOne);
  };
  if (audioElement.current)
    audioElement.current.onended = () => {
      if (repeatOne && audioElement.current) {
        // Repeat current song
        audioElement.current.currentTime = 0;
        audioElement.current.play();
      } else {
        // Play next song
        dispatch(setCurrentSongIndex(currentSongIndex + 1));
        dispatch(setCurrentSong(nextSong));
      }
    };
  const handlePrevious = () => {
    if (audioElement.current)
      if (storeProgress < 10 && currentSong != previousSong) {
        dispatch(setCurrentSong(previousSong));
        dispatch(setCurrentSongIndex(currentSongIndex - 1));
      } else {
        dispatch(updateSongProgress(0));
        audioElement.current.currentTime = 0;
      }
    play();
  };
  const handleNext = () => {
    next();
    dispatch(setCurrentSong(nextSong));
    play();
  };
  const [shuffleClicked, setShuffleClicked] = useState(false);
  const handleShuffle = () => {
    shuffle();
    setShuffleClicked(true);
  };
  return (
    <div className="playpausebutton-container">
      <button onClick={handleShuffle} className="button">
        <ShuffleIcon
          className={`shuffle-icon${isShuffled ? " glow" : ""}`}
          onMouseEnter={(e) => {
            if (!isShuffled) {
              e.currentTarget.classList.add("shuffle-hover");
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove("shuffle-hover");
          }}
        />
      </button>
      <div className="center-controls">
        <button onClick={handlePrevious} className="playpausebutton">
          {<PreviousIcon className="previousnext-icon" />}
        </button>
        <div className={`playpausebutton-ellipse${isPlaying ? " glow" : ""}`}>
          <button onClick={handleClick} className="playpausebutton">
            {isPlaying ? (
              <PauseIcon className="playpause-icon" />
            ) : (
              <PlayIcon className="playpause-icon play" />
            )}
          </button>
        </div>
        <button onClick={handleNext} className="playpausebutton">
          {<NextIcon className="previousnext-icon" />}
        </button>
      </div>
      <button onClick={handleRepeatOne} className="button">
        <RepeatIcon className={`shuffle-icon${repeatOne ? " glow" : ""}`} />
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
