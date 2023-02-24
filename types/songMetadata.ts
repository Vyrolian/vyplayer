import { PictureType, ShortcutTags } from "jsmediatags/types";

export type Data = {
  songs: {
    songData: ShortcutTags;
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
