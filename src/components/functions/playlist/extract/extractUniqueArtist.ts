import { FilteredSongs } from "../../../../../types/songMetadata";

export function extractUniqueArtist(filtered: FilteredSongs) {
  return Array.from(
    new Set(
      filtered.map((song) => {
        return (
          song.songData.artist &&
          song.songData.artist.split("/")[0].toLowerCase()
        );
      })
    )
  );
}
