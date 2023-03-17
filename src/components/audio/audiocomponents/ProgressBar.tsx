import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import "./ProgressBar.css";

type ProgressBarProps = {
  progress: number;
  audioElement: React.RefObject<HTMLAudioElement>;
};

function ProgressBar({ progress, audioElement }: ProgressBarProps) {
  const onProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const { offsetX } = event.nativeEvent;
    const progressPercentage = (offsetX / progressBar.offsetWidth) * 100;
    if (audioElement.current) {
      audioElement.current.currentTime =
        (audioElement.current.duration / 100) * progressPercentage;
    }
  };

  const sec = "0:00";
  const currentTime = audioElement.current
    ? audioElement.current.currentTime
    : 0;
  const duration = audioElement.current ? audioElement.current.duration : 0;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  const currentTimeDisplay = `${currentMinutes}:${currentSeconds
    .toFixed(0)
    .padStart(2, "0")}`;

  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);
  const durationDisplay = !Number.isNaN(duration)
    ? `${durationMinutes}:${durationSeconds.toFixed(0).padStart(2, "0")}`
    : sec;

  return (
    <div className="progress-containter">
      <div className="progress-bar" onClick={onProgressBarClick}>
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-time-container">
        <div className="progress-time-left">{currentTimeDisplay}</div>
        <div className="progress-time-right">{durationDisplay}</div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return {
    progress: state.audio.progress,
  };
};
const ProgressBarConnected = connect(mapStateToProps)(ProgressBar);

export default ProgressBarConnected;
