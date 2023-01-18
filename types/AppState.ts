export type AppState = {
  audio: AudioState;
  playlist: PlaylistState;
  volume: AudioState;
  progress: AudioState;
};
export type AudioState = {
  isPlaying: boolean;
  currentSong: File | null;
  currentTrack: Track;
  progress: number;
  volume: number;
};

export type PlaylistState = {
  tracks: Track[];
  currentTrackIndex: number;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: string;
};
