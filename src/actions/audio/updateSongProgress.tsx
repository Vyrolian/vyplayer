import { UpdateSongProgressAction } from "../../../types/audio/UpdateSongProgressAction";
export function updateSongProgress(progress: number): UpdateSongProgressAction {
  return {
    type: "UPDATE_SONG_PROGRESS",
    payload: { progress },
  };
}
