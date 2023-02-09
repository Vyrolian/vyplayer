import { SetCurrentSong, SetNextSong } from "../../../types/audio/SetSong";
export function setCurrentSong(currentSong: string): SetCurrentSong {
  return {
    type: "SET_CURRENT_SONG",
    payload: {
      currentSong,
    },
  };
}
export function setNextSong(nextSong: string): SetNextSong {
  return {
    type: "SET_NEXT_SONG",
    payload: {
      nextSong,
    },
  };
}
