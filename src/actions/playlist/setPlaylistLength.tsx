import { SetPlaylistLength } from "../../../types/playlist/SetPlaylistLength";
export function setPlaylistLength(playlistLength: number): SetPlaylistLength {
  return {
    type: "SET_PLAYLIST_LENGTH",
    payload: {
      playlistLength,
    },
  };
}
