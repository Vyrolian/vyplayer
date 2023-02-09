import {
  SetCurrentSong,
  SetNextSong,
  SetPreviousSong,
} from "../../../types/audio/SetSong";
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
export function setPreviousSong(previousSong: string): SetPreviousSong {
  return {
    type: "SET_PREVIOUS_SONG",
    payload: {
      previousSong,
    },
  };
}
