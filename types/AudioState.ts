export type AudioState = {
    isPlaying: boolean;
    currentTrack: Track | null;
    trackList: Track[];
  };
  
  export type Track = {
    id: string;
    title: string;
    artist: string;
    duration: number;
  };