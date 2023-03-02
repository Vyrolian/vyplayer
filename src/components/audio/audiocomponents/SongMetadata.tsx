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

  let currentSongTitle = currentSongData?.songData.title;
  let picture;
  if (currentSongData?.songData.album)
    picture = currentSongData?.songData.album.replace(
      /[<>:"\/\\|?*\x00-\x1F]/g,
      "_"
    );

  //console.log(picture);
  // console.log(currentSongData?.songData.album);
  return (
    <div>
      {currentSongTitle ? (
        <div>
          <img
            src={`media-loader://C:/test/${picture}.jpeg`}
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
