import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";
import { ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentSong } from "../../actions/audio/setCurrentSong";
import { Data } from "../../../types/songMetadata";

type Playlist = {
  data: Data;
};
type file = {
  file: File | null;
};
function Playlist({ data }: Playlist) {
  const dispatch = useDispatch();
  function handleSelectSong(p: string) {
    window.electronAPI.send("path-selected", p);

    dispatch(setCurrentSong(p));
  }
  console.log(data.filePaths[0]);
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
