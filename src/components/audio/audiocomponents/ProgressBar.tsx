import { Howl } from "howler";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import "./ProgressBar.css";

type ProgressBarProps = {
  progress: number;
  sound: Howl | undefined;
};

function ProgressBar({ progress, sound }: ProgressBarProps) {
  const onProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const { offsetX } = event.nativeEvent;

    if (sound) {
      const progressPercentage = (offsetX / progressBar.offsetWidth) * 100;
      sound.seek((sound.duration() / 100) * progressPercentage);
    }
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
