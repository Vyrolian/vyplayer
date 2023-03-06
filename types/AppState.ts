import { ShortcutTags, Tags } from "jsmediatags/types";
import { Playlist } from "./playlist/SetPlaylists";

export type AppState = {
  audio: AudioState;
  playlist: PlaylistState;
  volume: AudioState;
  progress: AudioState;
  currentSong: AudioState;
  nextSong: AudioState;
  previousSong: AudioState;
  currentPlaylist: AudioState;
  playlists: AudioState;
  deletedPlaylist: AudioState;
  isShuffled: AudioState;
};
export type AudioState = {
  isPlaying: boolean;
  currentSong: string;
  currentPlaylist: string;
  currentSongIndex: number;
  nextSong: string;
  previousSong: string;
  currentTrack: ShortcutTags;
  progress: number;
  volume: number;
  playlists: Playlist;
  deletedPlaylist: string;
  isShuffled: boolean;
  isNewSongSelected: boolean;
  nextSongIndex: number;
};

export type PlaylistState = {
  tracks: Track[];
  currentTrackIndex: number;
};

export type Track = {
  track: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file: string;
};
