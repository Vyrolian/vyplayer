import { ShortcutTags } from "jsmediatags/types";

export type Data = {
  filePaths: string[];
  songs: { songData: ShortcutTags }[];
};
