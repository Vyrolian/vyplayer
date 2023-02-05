import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";
import { ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { SetCurrentSong } from "../../../types/audio/SetCurrentSong";
import { setCurrentSong } from "../../actions/audio/setCurrentSong";
type Data = {
  filePaths: string[];
  songs: Tags;
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
  console.log(data.songs);
  return <div></div>;
}
const mapDispatchToProps = {
  setCurrentSong,
};
export default connect(null, mapDispatchToProps)(Playlist);
