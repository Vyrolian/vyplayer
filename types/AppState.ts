import { ShortcutTags, Tags } from "jsmediatags/types";

export type AppState = {
  audio: AudioState;
  playlist: PlaylistState;
  volume: AudioState;
  progress: AudioState;
  currentSong: AudioState;
  nextSong: AudioState;
  previousSong: AudioState;
};
export type AudioState = {
  isPlaying: boolean;
  currentSong: string;
  nextSong: string;
  previousSong: string;
  currentTrack: ShortcutTags;
  progress: number;
  volume: number;
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
