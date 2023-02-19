import { ShortcutTags } from "jsmediatags/types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../types/AppState";
import { Playlist } from "../../../types/playlist/SetPlaylists";
import { Data } from "../../../types/songMetadata";
import Select from "react-select";
import CurrentPlaylist from "./CurrentPlaylist";
type MenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  index: number;
  songs: {
    songData: ShortcutTags;
    filePath: string;
    playlists: string[];
  }[];
  playlists: Playlist;
  artist?: string;
  album?: string;
  currentPlaylist: string;
  onSongsRemoved: () => void;
};

const ContextMenu = ({
  x,
  y,
  onClose,
  index,
  songs,
  playlists,
  artist,
  album,
  currentPlaylist,
  onSongsRemoved,
}: MenuProps) => {
  console.log("CONTEXTMENU ARTINS", artist);
  console.log("CONTEXTMENU ALBUM", album);
  interface OptionType {
    value: string;
    label: string;
  }
  console.log("Context menu songs:", songs);
  const [selectedPlaylist, setSelectedPlaylist] = useState<OptionType | null>(
    null
  );

  function handleRemove() {
    const playlistName = currentPlaylist;
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
    console.log("Selected songs ", selectedSongs);
    selectedSongs.forEach((song) => {
      const playlistExists = song.playlists.includes(playlistName);
      console.log(playlistExists);
      if (playlistExists) {
        song.playlists = song.playlists.filter(
          (playlist) => playlist !== playlistName
        );
      }
    });
    console.log("asss");
    onSongsRemoved();
    onClose();
  }
  console.log(artist);
  function handleSelectChange(selectedOption: OptionType | null) {
    setSelectedPlaylist(selectedOption);
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
    console.log("Selected songs ", selectedSongs);
    selectedSongs.forEach((song) => {
      const playlistExists = song.playlists.includes(playlistName);
      if (!playlistExists) {
        song.playlists.push(playlistName);
      }
    });
    onClose();
  }
  console.log(songs);
  const options = playlists.map((playlist) => ({
    value: playlist.name,
    label: playlist.name,
  }));
  return (
    <div
      className="context-menu"
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "#fff",
        padding: "5px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
        zIndex: 1,
      }}
    >
      <button className="menu-item" onClick={() => handleRemove()}>
        Remove from playlist
      </button>

      <div className="menu-item">
        <Select options={options} onChange={handleSelectChange} />
      </div>
    </div>
  );
};
function mapStateToProps(state: AppState) {
  return {
    playlists: state.audio.playlists,
    currentPlaylist: state.audio.currentPlaylist,
  };
}
export default connect(mapStateToProps, null)(ContextMenu);
