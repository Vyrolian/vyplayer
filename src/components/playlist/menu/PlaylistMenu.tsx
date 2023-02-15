import React, { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./PlaylistMenu.css";
type Playlist = Array<{
  id: string;
  name: string;
}>;
const PlaylistMenu = () => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlist, setPlaylist] = useState<Playlist>([{ id: "0", name: "a " }]);
  function createNewPlaylist(name: string) {
    const newPlaylist = {
      id: nanoid(),
      name: name,
    };
    setPlaylist((prevPlaylist) => [newPlaylist, ...prevPlaylist]);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPlaylistName.trim() !== "") {
      createNewPlaylist(newPlaylistName);
      setNewPlaylistName("");
    }
  };
  console.log(playlist);
  function deletePlaylist(id: string) {
    setPlaylist((prevPlaylist) =>
      prevPlaylist.filter((playlist) => playlist.id !== id)
    );
  }
  return (
    <div className="playlist-menu">
      <h1>Playlists</h1>
      <form onSubmit={handleSubmit}>
        <label>
          New Playlist:
          <input
            type="text"
            value={newPlaylistName}
            onChange={(event) => setNewPlaylistName(event.target.value)}
          />
        </label>
        <button type="submit">Create</button>
      </form>
      <ul>
        {playlist.map((playlist) => (
          <li key={playlist.id}>
            {playlist.name}
            <button onClick={() => deletePlaylist(playlist.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistMenu;
