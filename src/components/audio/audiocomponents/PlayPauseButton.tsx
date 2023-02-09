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
};
function PlayPauseButton({
  isPlaying,
  play,
  pause,
  audioElement,
  nextSong,
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
  const handleNext = () => {
    dispatch(setCurrentSong(nextSong));
    console.log(nextSong);
  };
  return (
    <div>
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
