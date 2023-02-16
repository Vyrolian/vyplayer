export type SetCurrentPlaylistAction = {
  type: "SET_CURRENT_PLAYLIST";
  payload: {
    currentPlaylist: string;
  };
};
