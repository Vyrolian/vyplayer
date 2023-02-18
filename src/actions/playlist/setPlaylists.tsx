import { Playlist, SetPlaylists } from "../../../types/playlist/SetPlaylists";
export function setPlaylists(playlists: Playlist): SetPlaylists {
  return {
    type: "SET_PLAYLISTS",
    payload: {
      playlists,
    },
  };
}
