import { PictureType, ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setNextSong,
  setPreviousSong,
} from "../../actions/audio/setSong";
import { Data } from "../../../types/songMetadata";
import { AppState } from "../../../types/AppState";

type Playlist = {
  data: Data;
};
type file = {
  file: File | null;
};

function Playlist({ data }: Playlist) {
  const dispatch = useDispatch();

  function handleSelectSong(index: number) {
    dispatch(setCurrentSongIndex(index));
    console.log(index + "dick");
    dispatch(setCurrentSong(data.songs[index].filePath));
  }

  function convertImage(
    imageSrc: string,
    albumArtwork: { picture: { data: any; format: any } }
  ) {
    const { data, format } = albumArtwork.picture;
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
      base64String += String.fromCharCode(data[i]);
    }
    imageSrc = `data:${format};base64,${window.btoa(base64String)}`;
  }

  return (
    <div className="songs-container">
      {data.songs
        .sort((a, b) => {
          if (!a.songData.artist) return -1;
          if (!b.songData.artist) return 1;
          if (a.songData.artist === b.songData.artist) {
            if (!a.songData.album) return -1;
            if (!b.songData.album) return 1;
            return a.songData.album.localeCompare(b.songData.album);
          }
          return a.songData.artist.localeCompare(b.songData.artist);
        })
        .map((song, index) => (
          <div key={song.filePath}>
            {song.songData.artist !==
              (data.songs[index - 1] &&
                data.songs[index - 1].songData.artist) && (
              <p className="artist-name">{song.songData.artist}</p>
            )}
            {song.songData.album !==
              (data.songs[index - 1] &&
                data.songs[index - 1].songData.album) && (
              <p className="album-name">{song.songData.album}</p>
            )}
            <button className="song" onClick={() => handleSelectSong(index)}>
              {song.songData.title} - {index}
            </button>
          </div>
        ))}
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  nextSong: state.audio.nextSong,
});
const mapDispatchToProps = {
  setCurrentSong,
  setCurrentSongIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
