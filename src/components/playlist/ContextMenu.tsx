import { ShortcutTags } from "jsmediatags/types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../types/AppState";
import { Playlist } from "../../../types/playlist/SetPlaylists";
import { Data } from "../../../types/songMetadata";
import Select from "react-select";
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
};

const ContextMenu = ({
  x,
  y,
  onClose,
  index,
  songs,
  playlists,
  artist,
}: MenuProps) => {
  interface OptionType {
    value: string;
    label: string;
  }
  console.log("Context menu songs:", songs);
  const [selectedPlaylist, setSelectedPlaylist] = useState<OptionType | null>(
    null
  );
  const filteredSongs = artist
    ? songs.filter((song) => song.songData.artist === artist)
    : songs;
  function handlePlay() {
    console.log("Playing song: ", "ass");
    onClose();
  }
  console.log(artist);
  function handleSelectChange(selectedOption: OptionType | null) {
    setSelectedPlaylist(selectedOption);
    if (!selectedOption) {
      return;
    }
    const playlistName = selectedOption.value;
    const selectedSongs = artist
      ? songs.filter(
          (song) => song.songData.artist?.toLocaleLowerCase() === artist
        )
      : [songs[index]];
    console.log("Selected songs ", selectedSongs);
    selectedSongs.forEach((song) => {
      const playlistExists = song.playlists.includes(playlistName);
      if (!playlistExists) {
        song.playlists.push(playlistName);
      }
      console.log("Adding song to playlist: ", song.songData);
    });
    onClose();
  }
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
      <div className="menu-item" onClick={handlePlay}>
        Play
      </div>

      <div className="menu-item">
        <Select options={options} onChange={handleSelectChange} />
      </div>
    </div>
  );
};
function mapStateToProps(state: AppState) {
  return {
    playlists: state.audio.playlists,
  };
}
export default connect(mapStateToProps, null)(ContextMenu);
