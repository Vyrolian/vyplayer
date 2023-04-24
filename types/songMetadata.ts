import { PictureType, ShortcutTags } from "jsmediatags/types";

export interface ShortcutTagsDuration {
  title?: string | undefined;
  artist?: string | undefined;
  album?: string | undefined;
  year?: string | undefined;
  comment?: string | undefined;
  track?: string | undefined;
  genre?: string | undefined;
  duration?: number | undefined;
  lyrics?: string | undefined;
}
export type Data = {
  songs: {
    songData: ShortcutTagsDuration;
    filePath: string;
    playlists: string[];
  }[];
};
export type FilteredSongs = {
  songData: ShortcutTags;
  filePath: string;
  playlists: string[];
}[];
export type AlbumArtworks = {
  album: string;
  picture: PictureType;
}[];
