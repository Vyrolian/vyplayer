import React, { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./PlaylistMenu.css";
import { connect, useDispatch } from "react-redux";
import { setCurrentPlaylist } from "../../../actions/playlist/setCurrentPlaylist";
import { setPlaylists } from "../../../actions/playlist/setPlaylists";
import { play } from "../../../actions/audio/audio";
import { AppState } from "../../../../types/AppState";
import { Playlist } from "../../../../types/playlist/SetPlaylists";
type PlaylistMenu = {
  playlists: Playlist;
};
const PlaylistMenu = ({ playlists }: PlaylistMenu) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  function createNewPlaylist(name: string) {
    const newPlaylist = {
      id: nanoid(),
      name: name,
    };

    dispatch(setPlaylists([...playlists, newPlaylist]));
  }
  const dispatch = useDispatch();

  function handleSelectPlaylist(playlistName: string) {
    dispatch(setCurrentPlaylist(playlistName));
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPlaylistName.trim() !== "") {
      createNewPlaylist(newPlaylistName);
      setNewPlaylistName("");
    }
  };
  console.log(playlists);
  function deletePlaylist(id: string) {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
    dispatch(setPlaylists(updatedPlaylists));
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
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <button onClick={() => handleSelectPlaylist(playlist.name)}>
              {playlist.name}
            </button>
            {playlist.name !== "Library" && (
              <button onClick={() => deletePlaylist(playlist.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    playlists: state.audio.playlists,
  };
}
export default connect(mapStateToProps, null)(PlaylistMenu);
