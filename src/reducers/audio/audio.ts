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
  SetNewSong,
  SetNextSong,
  SetPreviousSong,
} from "../../../types/audio/SetSong";
import { SetCurrentPlaylistAction } from "../../../types/playlist/SetCurrentPlaylistAction";
import { Playlist, SetPlaylists } from "../../../types/playlist/SetPlaylists";
import { SetDeletedPlaylist } from "../../../types/playlist/SetDeletedPlaylist";
let currentSongIndex = 0;
const initialState: AudioState = {
  isPlaying: false,
  progress: 0,
  volume: 0.2,
  nextSong: "",
  currentSong: "",
  previousSong: "",
  currentTrack: {},
  currentSongIndex: currentSongIndex,
  currentPlaylist: "Library",
  playlists: [{ id: "Library", name: "Library" }],
  deletedPlaylist: "",
  isShuffled: false,
  isNewSongSelected: false,
  nextSongIndex: currentSongIndex + 1,
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
    | SetPlaylists
    | SetDeletedPlaylist
    | SetNewSong
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
    case "NEXT":
      console.log(currentSongIndex);
      return {
        ...state,
        currentSongIndex: state.nextSongIndex,
        nextSongIndex: state.nextSongIndex + 1,
      };
    case "SHUFFLE":
      console.log("Shuffled");
      return {
        ...state,
        isShuffled: !state.isShuffled,
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
      //    console.log("Current song: ", action.payload.currentSong);
      return {
        ...state,
        currentSong: action.payload.currentSong,
        isNewSongSelected: false,
      };
    case "SET_NEW_SONG":
      return {
        ...state,
        isNewSongSelected: true,
      };
    case "SET_CURRENT_SONG_INDEX":
      //     console.log("Current song index: ", action.payload.currentSongIndex);
      return {
        ...state,
        currentSongIndex: action.payload.currentSongIndex,
        nextSongIndex: action.payload.currentSongIndex + 1,
      };
    case "SET_NEXT_SONG":
      console.log("Next song: ", action.payload.nextSong);
      return {
        ...state,
        nextSong: action.payload.nextSong,
      };
    case "SET_PREVIOUS_SONG":
      //    console.log("Previous song:", action.payload.previousSong);
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
    case "SET_PLAYLISTS":
      console.log("Playlists: ", action.payload.playlists);
      return {
        ...state,
        playlists: action.payload.playlists,
      };
    case "SET_DELETED_PLAYLIST":
      console.log("Deleted playlist: ", action.payload.deletedPlaylist);
      return {
        ...state,
        deletedPlaylist: action.payload.deletedPlaylist,
      };
    // Other cases go here
    default:
      return state;
  }
};
