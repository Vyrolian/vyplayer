import { FilteredSongs } from "../../../../types/songMetadata";

export function filteredByCurrentPlaylist(
  filteredSongs: FilteredSongs,
  currentPlaylist: string
) {
  filteredSongs.filter(
    (song) => song.playlists && song.playlists.includes(currentPlaylist)
  );
  return filteredSongs;
}
