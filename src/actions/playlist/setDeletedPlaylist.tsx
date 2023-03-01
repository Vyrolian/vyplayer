import { SetDeletedPlaylist } from "../../../types/playlist/SetDeletedPlaylist";
export function setDeletedPlaylist(
  deletedPlaylist: string
): SetDeletedPlaylist {
  return {
    type: "SET_DELETED_PLAYLIST",
    payload: {
      deletedPlaylist,
    },
  };
}
