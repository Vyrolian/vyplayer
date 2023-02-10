import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import "./ProgressBar.css";

type ProgressBarProps = {
  progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;

  const onProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const { offsetX } = event.nativeEvent;
    const progressPercentage = (offsetX / progressBar.offsetWidth) * 100;
    audioElement.currentTime =
      (audioElement.duration / 100) * progressPercentage;
  };
  const sec = "0:00";
  const currentTime = audioElement ? audioElement.currentTime : 0;
  const duration = audioElement ? audioElement.duration : 0;

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
    <div>
      <div className="progress-bar" onClick={onProgressBarClick}>
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-time">
        {currentTimeDisplay} / {durationDisplay}
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
