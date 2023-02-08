import { AudioAction } from "../../../types/audio/audio";
import { AudioState } from "../../../types/AppState";
import {
  ResetSongProgressAction,
  UpdateSongProgressAction,
} from "../../../types/audio/UpdateSongProgressAction";
import { SetVolumeAction } from "../../../types/audio/SetVolumeAction";
import { SetCurrentSong } from "../../../types/audio/SetCurrentSong";
const initialState: AudioState = {
  isPlaying: false,
  progress: 0,
  volume: 0.2,
  currentSong: "",
  currentTrack: {
    id: "",
    title: "",
    artist: "",
    duration: 0,
    file: "",
  },
};

export default (
  state: AudioState = initialState,
  action:
    | AudioAction
    | UpdateSongProgressAction
    | SetVolumeAction
    | ResetSongProgressAction
    | SetCurrentSong
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
      //   console.log(action.payload.progress);
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
    case "SET_CURRENT_SONG":
      console.log("Current song: ", action.payload.currentSong);
      return {
        ...state,
        currentSong: action.payload.currentSong,
      };
    // Other cases go here
    default:
      return state;
  }
};
