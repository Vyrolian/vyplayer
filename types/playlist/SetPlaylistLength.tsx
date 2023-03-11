export interface SetPlaylistLength {
  type: "SET_PLAYLIST_LENGTH";
  payload: {
    playlistLength: number;
  };
}
