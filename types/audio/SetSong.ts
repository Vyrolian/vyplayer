export interface SetCurrentSong {
  type: "SET_CURRENT_SONG";
  payload: {
    currentSong: string;
  };
}
export interface SetCurrentSongInfo {
  type: "SET_CURRENT_SONG_INFO";
  payload: {
    currentSongTitle: string;
    currentSongArtist: string;
  };
}
export interface SetCurrentSongIndex {
  type: "SET_CURRENT_SONG_INDEX";
  payload: {
    currentSongIndex: number;
  };
}
export interface SetNextSong {
  type: "SET_NEXT_SONG";
  payload: {
    nextSong: string;
  };
}
export interface SetNextSongIndex {
  type: "SET_NEXT_SONG_INDEX";
  payload: {
    nextSongIndex: number;
  };
}
export interface SetPreviousSong {
  type: "SET_PREVIOUS_SONG";
  payload: {
    previousSong: string;
  };
}
export type SetNewSong = {
  type: "SET_NEW_SONG";
};
