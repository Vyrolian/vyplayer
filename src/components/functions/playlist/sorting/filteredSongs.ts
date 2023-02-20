import { Data } from "../../../../../types/songMetadata";

export function filteredSongs(data: Data) {
  let filtered = data.songs.sort((a, b) => {
    // if artist is not defined, move the song to the top
    if (!a.songData.artist) return -1;
    if (!b.songData.artist) return 1;

    // convert artist names to lowercase for comparison
    const aArtist = a.songData.artist.toLowerCase();
    const bArtist = b.songData.artist.toLowerCase();

    // if the artist names are the same or one starts with the other + "/"
    if (
      aArtist === bArtist ||
      bArtist.startsWith(aArtist + "/") ||
      aArtist.startsWith(bArtist + "/")
    ) {
      // if album is not defined, move the song to the top
      if (!a.songData.album) return -1;
      if (!b.songData.album) return 1;
      // compare the album names
      return a.songData.album.localeCompare(b.songData.album);
    }
    if (aArtist === undefined) {
    }
    // compare the artist names
    return aArtist.localeCompare(bArtist);
  });

  return filtered;
}
