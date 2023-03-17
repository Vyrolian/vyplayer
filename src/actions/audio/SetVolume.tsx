import { SetVolumeAction } from "../../../types/audio/SetVolumeAction";

export function setVolume(
  volume: number,
  audioElement: React.RefObject<HTMLAudioElement>
): SetVolumeAction {
  if (audioElement.current) {
    audioElement.current.volume = volume;
  }
  return {
    type: "SET_VOLUME",
    payload: { volume },
  };
}
