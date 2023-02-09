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

    dispatch(setCurrentSong(data.filePaths[index]));
    dispatch(setPreviousSong(data.filePaths[index - 1]));
    dispatch(setNextSong(data.filePaths[index + 1]));
  }
  useEffect(() => {
    setCurrentSongIndex(currentSongIndex + 1);
    let previousSongIndex = currentSongIndex - 1;
    let nextSongIndex = currentSongIndex + 1;

    if (nextSongIndex >= data.filePaths.length) {
      nextSongIndex = 0;
    }
    if (currentSongIndex + 1 >= data.filePaths.length) {
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
    dispatch(setPreviousSong(data.filePaths[previousSongIndex]));
    dispatch(setNextSong(data.filePaths[nextSongIndex]));
  }, [currentSong]);
  console.log(data.songs);
  return (
    <div>
      {data.songs && data.songs.length > 0 ? (
        data.songs
          .sort(
            (a, b) =>
              parseInt(a.songData.track || "0") -
              parseInt(b.songData.track || "0")
          )
          .map((song: { songData: ShortcutTags }, index: number) => (
            <button onClick={() => handleSelectSong(index)}>
              {song.songData.artist}-{song.songData.title} -{" "}
              {song.songData.track}
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
