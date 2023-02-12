import { PictureType, ShortcutTags } from "jsmediatags/types";

export type Data = {
  songs: {
    songData: ShortcutTags;
    filePath: string;
  }[];
  albumArtworks: Array<{ album: string; picture: PictureType }>;
};
