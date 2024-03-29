import React, { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./PlaylistMenu.css";
import { connect, useDispatch } from "react-redux";
import { setCurrentPlaylist } from "../../../actions/playlist/setCurrentPlaylist";
import { setPlaylists } from "../../../actions/playlist/setPlaylists";
import { play } from "../../../actions/audio/audio";
import { AppState } from "../../../../types/AppState";
import { Playlist } from "../../../../types/playlist/SetPlaylists";
import { setDeletedPlaylist } from "../../../actions/playlist/setDeletedPlaylist";
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
    console.log("Current playlists:", playlists);
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
    dispatch(setDeletedPlaylist(id));
    dispatch(setPlaylists(updatedPlaylists));
  }
  return (
    <div className="playlist-menu">
      <h1>Playlists</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            className="playlist-menu-input"
            type="text"
            value={newPlaylistName}
            placeholder="Enter playlist name"
            onChange={(event) => setNewPlaylistName(event.target.value)}
          />
        </label>
        <button className="playlistmenu-button" type="submit">
          Create
        </button>
      </form>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <span onClick={() => handleSelectPlaylist(playlist.id)}>
              {playlist.name}
            </span>
            {playlist.name !== "Library" && (
              <button
                className="playlistmenu-button delete-button"
                onClick={() => deletePlaylist(playlist.id)}
              >
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
