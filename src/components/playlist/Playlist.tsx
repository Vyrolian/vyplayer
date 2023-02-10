import { ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setNextSong,
  setPreviousSong,
} from "../../actions/audio/setSong";
import { Data } from "../../../types/songMetadata";
import { AppState } from "../../../types/AppState";

type Playlist = {
  data: Data;
  currentSong: string;
};
type file = {
  file: File | null;
};
function Playlist({ data, currentSong }: Playlist) {
  const dispatch = useDispatch();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  function handleSelectSong(index: number) {
    setCurrentSongIndex(index);
    dispatch(setCurrentSong(data.songs[index].filePath));
  }
  console.log(data.songs);
  useEffect(() => {
    setCurrentSongIndex((prevIndex) => prevIndex + 1);
    let previousSongIndex = currentSongIndex - 1;
    let nextSongIndex = currentSongIndex + 1;

    if (nextSongIndex >= data.songs.length) {
      nextSongIndex = 0;
      setCurrentSongIndex(0);
    }

    if (previousSongIndex < 0) {
      previousSongIndex = 0;
    }
    console.log(
      previousSongIndex +
        " - Previous Index " +
        currentSongIndex +
        " - Current Index " +
        nextSongIndex +
        " - Next Index "
    );
    if (previousSongIndex >= 0 && previousSongIndex < data.songs.length) {
      dispatch(setPreviousSong(data.songs[previousSongIndex].filePath));
    }
    if (previousSongIndex >= 0 && previousSongIndex < data.songs.length) {
      dispatch(setNextSong(data.songs[nextSongIndex].filePath));
    }
  }, [currentSong]);
  console.log(data.songs);
  return (
    <div>
      {data.songs && data.songs.length > 0 ? (
        data.songs.map((song: { songData: ShortcutTags }, index: number) => (
          <button onClick={() => handleSelectSong(index)}>
            {song.songData.artist}-{song.songData.title} - {index}
          </button>
        ))
      ) : (
        <p>No songs found</p>
      )}
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  currentSong: state.audio.currentSong,
  nextSong: state.audio.nextSong,
});
const mapDispatchToProps = {
  setCurrentSong,
};

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
