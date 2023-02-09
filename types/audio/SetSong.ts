export interface SetCurrentSong {
  type: "SET_CURRENT_SONG";
  payload: {
    currentSong: string;
  };
}
export interface SetNextSong {
  type: "SET_NEXT_SONG";
  payload: {
    nextSong: string;
  };
}
