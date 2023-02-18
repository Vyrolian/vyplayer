import { PictureType, ShortcutTags } from "jsmediatags/types";

export type Data = {
  songs: {
    songData: ShortcutTags;
    filePath: string;
    playlists: string[];
  }[];
  albumArtworks: Array<{ album: string; picture: PictureType }>;
};
