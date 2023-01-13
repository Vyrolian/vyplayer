export interface UpdateSongProgressAction {
  type: "UPDATE_SONG_PROGRESS";
  payload: {
    progress: number;
  };
}
export interface ResetSongProgressAction {
  type: "RESET_SONG_PROGRESS";
  payload: {
    progress: number;
  };
}
