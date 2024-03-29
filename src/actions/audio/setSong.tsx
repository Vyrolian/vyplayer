import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetNewSong,
  SetNextSong,
  SetNextSongIndex,
  SetPreviousSong,
  SetCurrentSongInfo,
} from "../../../types/audio/SetSong";
export function setCurrentSong(currentSong: string): SetCurrentSong {
  return {
    type: "SET_CURRENT_SONG",
    payload: {
      currentSong,
    },
  };
}
export function setCurrentSongInfo(
  currentSongTitle: string,
  currentSongArtist: string
): SetCurrentSongInfo {
  return {
    type: "SET_CURRENT_SONG_INFO",
    payload: {
      currentSongTitle,
      currentSongArtist,
    },
  };
}
export function setCurrentSongIndex(
  currentSongIndex: number
): SetCurrentSongIndex {
  return {
    type: "SET_CURRENT_SONG_INDEX",
    payload: {
      currentSongIndex,
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
export function setNextSongIndex(nextSongIndex: number): SetNextSongIndex {
  return {
    type: "SET_NEXT_SONG_INDEX",
    payload: {
      nextSongIndex,
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
export function setNewSong(): SetNewSong {
  return { type: "SET_NEW_SONG" };
}
