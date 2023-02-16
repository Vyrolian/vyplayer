import { SetCurrentPlaylistAction } from "../../../types/playlist/SetCurrentPlaylistAction";

export function setCurrentPlaylist(
  currentPlaylist: string
): SetCurrentPlaylistAction {
  return {
    type: "SET_CURRENT_PLAYLIST",
    payload: {
      currentPlaylist,
    },
  };
}
