const PlaylistHeader = ({ playlistName, playlistImage }: any) => {
  return (
    <div className="playlist-header">
      <img src={playlistImage} alt={playlistName} className="playlist-image" />
      <h1 className="playlist-title">{playlistName}</h1>
    </div>
  );
};
