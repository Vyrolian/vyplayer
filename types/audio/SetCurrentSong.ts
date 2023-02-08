export interface SetCurrentSong {
  type: "SET_CURRENT_SONG";
  payload: {
    currentSong: string;
  };
}
