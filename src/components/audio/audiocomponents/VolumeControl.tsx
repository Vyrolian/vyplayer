import React, {
  ChangeEvent,
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { setVolume } from "../../../actions/audio/SetVolume";
import { ReactComponent as VolumeIcon } from "../../../icons/Volume.svg";
import "./VolumeControl.css";

type VolumeControlProps = {
  setVolume: (
    volume: number,
    audioElement: React.RefObject<HTMLAudioElement>
  ) => void;
  defaultValue: number;
  volume: number;
  audioElement: React.RefObject<HTMLAudioElement>;
};
interface InputStyle extends React.CSSProperties {
  "--filled-width"?: string;
}
function VolumeControl({
  setVolume,
  defaultValue,
  volume,
  audioElement,
}: VolumeControlProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(event.target.valueAsNumber, audioElement);
    const value = event.target.valueAsNumber;
    console.log(value, "VALUE");
    console.log(defaultValue);
    event.target.style.setProperty("--filled-width", `${(value / 1) * 100}%`);
  };

  useEffect(() => {
    if (localStorage.getItem("volume") !== volume.toString()) {
      // Whenever the volume changes, update the value in local storage
      localStorage.setItem("volume", volume.toString());
    }
  }, [volume]);
  const [filledWidth, setFilledWidth] = useState(
    `${(defaultValue / 1) * 100}%`
  );
  const inputStyle: InputStyle = { "--filled-width": filledWidth };
  return (
    <div className="volume-control-container">
      <VolumeIcon className="volume-icon" />
      <div className="input-wrapper">
        <input
          className="volume-control"
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={handleChange}
          defaultValue={defaultValue}
          style={inputStyle}
        />
      </div>
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
