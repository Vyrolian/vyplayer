import { PictureType, ShortcutTags } from "jsmediatags/types";

export type Data = {
  songs: {
    artist: any;
    songData: ShortcutTags;
    filePath: string;
  }[];
  albumArtworks: Array<{ album: string; picture: PictureType }>;
};
