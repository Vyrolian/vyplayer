import { ResetSongProgressAction } from "../../../types/audio/UpdateSongProgressAction";
export function resetProgress(): ResetSongProgressAction {
  return {
    type: "RESET_SONG_PROGRESS",
    payload: { progress: 0 },
  };
}
