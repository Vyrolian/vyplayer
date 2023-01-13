import { AudioAction } from "../../../types/audio/audio";
import { AudioState } from "../../../types/AppState";
import {
  ResetSongProgressAction,
  UpdateSongProgressAction,
} from "../../../types/audio/UpdateSongProgressAction";
import { SetVolumeAction } from "../../../types/audio/SetVolumeAction";
const initialState: AudioState = {
  isPlaying: false,
  currentTrack: {
    id: "",
    title: "",
    artist: "",
    duration: 0,
    file: "",
  },
  progress: 0,
  volume: 0.2,
};
type UpdateVolumeAction = {
  type: "UPDATE_VOLUME";
  payload: {
    volume: number;
  };
};
export default (
  state: AudioState = initialState,
  action:
    | AudioAction
    | UpdateSongProgressAction
    | SetVolumeAction
    | ResetSongProgressAction
    | UpdateVolumeAction
) => {
  switch (action.type) {
    case "PLAY":
      return {
        ...state,
        isPlaying: true,
      };
    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      };

    case "UPDATE_SONG_PROGRESS":
      return {
        ...state,
        progress: action.payload.progress,
      };
    case "SET_VOLUME":
      return {
        ...state,
        volume: action.payload.volume,
      };
    case "RESET_SONG_PROGRESS":
      return {
        ...state,
        progress: action.payload.progress,
      };
    case "UPDATE_VOLUME":
      return {
        ...state,
        volume: action.payload.volume,
      };
    // Other cases go here
    default:
      return state;
  }
};
