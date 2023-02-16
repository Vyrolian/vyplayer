import { PictureType, ShortcutTags } from "jsmediatags/types";

export type Data = {
  songs: {
    songData: ShortcutTags;
    filePath: string;
    playlist: string[];
  }[];
  albumArtworks: Array<{ album: string; picture: PictureType }>;
};
