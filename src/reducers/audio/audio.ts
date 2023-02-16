import { AudioAction } from "../../../types/audio/audio";
import { AudioState } from "../../../types/AppState";
import {
  ResetSongProgressAction,
  UpdateSongProgressAction,
} from "../../../types/audio/UpdateSongProgressAction";
import { SetVolumeAction } from "../../../types/audio/SetVolumeAction";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetNextSong,
  SetPreviousSong,
} from "../../../types/audio/SetSong";
import { SetCurrentPlaylistAction } from "../../../types/playlist/SetCurrentPlaylistAction";
const initialState: AudioState = {
  isPlaying: false,
  progress: 0,
  volume: 0.2,
  nextSong: "",
  currentSong: "",
  previousSong: "",
  currentTrack: {},
  currentSongIndex: 0,
  currentPlaylist: "",
};

export default (
  state: AudioState = initialState,
  action:
    | AudioAction
    | UpdateSongProgressAction
    | SetVolumeAction
    | ResetSongProgressAction
    | SetCurrentSong
    | SetCurrentSongIndex
    | SetNextSong
    | SetPreviousSong
    | SetCurrentPlaylistAction
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
    case "SET_CURRENT_SONG_INDEX":
      console.log("Current song index: ", action.payload.currentSongIndex);
      return {
        ...state,
        currentSongIndex: action.payload.currentSongIndex,
      };
    case "SET_NEXT_SONG":
      console.log("Next song: ", action.payload.nextSong);
      return {
        ...state,
        nextSong: action.payload.nextSong,
      };
    case "SET_PREVIOUS_SONG":
      console.log("Previous song:", action.payload.previousSong);
      return {
        ...state,
        previousSong: action.payload.previousSong,
      };
    case "SET_CURRENT_PLAYLIST":
      console.log("Current playlist: ", action.payload.currentPlaylist);
      return {
        ...state,
        currentPlaylist: action.payload.currentPlaylist,
      };
    // Other cases go here
    default:
      return state;
  }
};
