import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";
import { ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { SetCurrentSong } from "../../../types/audio/SetCurrentSong";
import { setCurrentSong } from "../../actions/audio/setCurrentSong";
type Data = {
  filePaths: string[];
  songs: { songData: ShortcutTags }[];
};
var jsmediatags = window.jsmediatags;
type Playlist = {
  data: Data;
};
type file = {
  file: File | null;
};
function Playlist({ data }: Playlist) {
  function handleSelectSong(p: string) {
    window.electronAPI.send("path-selected", p);
  }

  return (
    <div>
      {data.songs && data.songs.length > 0 ? (
        data.songs.map((song: { songData: ShortcutTags }, index: any) => (
          <button onClick={() => handleSelectSong(data.filePaths[index])}>
            {song.songData.artist}-{song.songData.title}
          </button>
        ))
      ) : (
        <p>No songs found</p>
      )}
    </div>
  );
}
const mapDispatchToProps = {
  setCurrentSong,
};
export default connect(null, mapDispatchToProps)(Playlist);
