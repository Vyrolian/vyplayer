import { ShortcutTags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../types/AppState";
import { Data } from "../../../../types/songMetadata";
type SongMetadata = {
  data1: Data;
  currentSong: string;
};
function SongMetadata({ data1, currentSong }: SongMetadata) {
  let currentSongData = data1.songs.find(
    (song) => song.filePath === currentSong
  );
  let imageSrc;
  let albumArtwork = data1.albumArtworks.find(
    (artwork) => artwork.album === currentSongData?.songData.album
  );

  if (albumArtwork) {
    const { data, format } = albumArtwork.picture;
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
      base64String += String.fromCharCode(data[i]);
    }
    imageSrc = `data:${format};base64,${window.btoa(base64String)}`;
  } else {
    imageSrc = "";
  }

  let currentSongTitle = currentSongData?.songData.title;
  let picture = currentSongData?.songData.picture;
  return (
    <div>
      {currentSongTitle ? (
        <div>
          <img
            src={imageSrc}
            style={{
              width: "150px",
            }}
          />
          {currentSongData?.songData.artist} - {currentSongData?.songData.title}
        </div>
      ) : (
        <div>No title found</div>
      )}
    </div>
  );
}
function mapStateToProps(state: AppState) {
  return {
    nextSong: state.audio.nextSong,
    volume: state.audio.volume,
    currentSong: state.audio.currentSong,
  };
}

export default connect(mapStateToProps, null)(SongMetadata);
