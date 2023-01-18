import { SetCurrentSong } from "../../../types/audio/SetCurrentSong";
export function setCurrentSong(currentSong: any): SetCurrentSong {
  return {
    type: "SET_CURRENT_SONG",
    payload: {
      currentSong,
    },
  };
}
