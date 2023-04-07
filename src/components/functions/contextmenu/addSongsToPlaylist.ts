import { ShortcutTags } from "jsmediatags/types";

interface OptionType {
  value: string;
  label: string;
}
function addSongsToPlaylist(
  selectedOption: OptionType | null,
  songs: {
    songData: ShortcutTags;
    filePath: string;
    playlists: string[];
  }[],
  index: number,
  artist?: string,
  album?: string
) {
  if (!selectedOption) {
    return;
  }
  const playlistName = selectedOption.value;
  let selectedSongs = [];

  if (artist) {
    selectedSongs = songs.filter(
      (song) =>
        song.songData.artist?.toLocaleLowerCase() === artist &&
        (album ? song.songData.album === album : true)
    );
  } else if (album) {
    selectedSongs = songs.filter((song) => song.songData.album == album);
  } else {
    selectedSongs = [songs[index]];
  }

  selectedSongs.forEach((song) => {
    const playlistExists = song.playlists.includes(playlistName);
    if (!playlistExists) {
      song.playlists.push(playlistName);
    }
  });
}
export default addSongsToPlaylist;
