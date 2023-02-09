import { Howl } from "howler";
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
  return (
    <div className="progress-bar" onClick={onProgressBarClick}>
      <div className="progress" style={{ width: `${progress}%` }}></div>
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
