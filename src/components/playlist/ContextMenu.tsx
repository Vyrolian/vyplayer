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
};

const ContextMenu = ({ x, y, onClose, index, songs, playlists }: MenuProps) => {
  interface OptionType {
    value: string;
    label: string;
  }

  const [selectedPlaylist, setSelectedPlaylist] = useState<OptionType | null>(
    null
  );

  function handlePlay() {
    console.log("Playing song: ", "ass");
    onClose();
  }

  function handleSelectChange(selectedOption: OptionType | null) {
    setSelectedPlaylist(selectedOption);
    const song = songs[index];
    const playlistExists = song.playlists.includes(selectedOption?.value ?? "");
    if (!playlistExists) {
      song.playlists.push(selectedOption?.value ?? "");
    }
    console.log("Adding song to playlist: ", song.songData);
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
