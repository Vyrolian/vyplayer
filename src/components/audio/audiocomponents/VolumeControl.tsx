import React, { useEffect, useRef } from "react";

import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { setVolume } from "../../../actions/audio/SetVolume";
import "./VolumeControl.css";

type VolumeControlProps = {
  setVolume: typeof setVolume;
  defaultValue: number;
  volume: number;
};

function VolumeControl({
  setVolume,
  defaultValue,
  volume,
}: VolumeControlProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(event.target.valueAsNumber);
  };
  useEffect(() => {
    if (localStorage.getItem("volume") !== volume.toString()) {
      // Whenever the volume changes, update the value in local storage
      localStorage.setItem("volume", volume.toString());
    }
  }, [volume]);
  return (
    <div>
      <input
        type="range"
        min="0"
        max="0.5"
        step="0.01"
        onChange={handleChange}
        defaultValue={defaultValue}
      />
    </div>
  );
}

const mapDispatchToProps = {
  setVolume,
};
function mapStateToProps(state: AppState) {
  return {
    volume: state.audio.volume,
  };
}
const VolumeControlConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(VolumeControl);
export default VolumeControlConnected;
