const SongRow = ({ song, index, handleSelectSong }: any) => {
  return (
    <tr className="song-row" onClick={() => handleSelectSong(index)}>
      <td className="song-number">{index + 1}</td>
      <td className="song-artist">{song.songData.artist}</td>
      <td className="song-title">{song.songData.title}</td>
      <td className="song-album">{song.songData.album}</td>
      <td className="song-duration">{song.songData.duration}</td>
    </tr>
  );
};
