import { SetVolumeAction } from "../../../types/audio/SetVolumeAction";

export function setVolume(volume: number): SetVolumeAction {
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;
  audioElement.volume = volume;
  return {
    type: "SET_VOLUME",
    payload: { volume },
  };
}
