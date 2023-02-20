import { ShortcutTags } from "jsmediatags/types";
import { FilteredSongs } from "../../../../../types/songMetadata";

export function extractAlbums(artistSongs: FilteredSongs) {
  return Array.from(new Set(artistSongs.map((song) => song.songData.album)));
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // console.log(x);
  });
}
