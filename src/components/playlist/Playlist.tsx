import { ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setCurrentSong, setNextSong } from "../../actions/audio/setSong";
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
    dispatch(setNextSong(data.filePaths[index + 1]));
  }
  useEffect(() => {
    setCurrentSongIndex(currentSongIndex + 1);
    let nextSongIndex = currentSongIndex + 1;

    if (nextSongIndex >= data.filePaths.length) {
      nextSongIndex = 0;
    }
    if (currentSongIndex + 1 >= data.filePaths.length) {
      setCurrentSongIndex(0);
    }
    console.log(
      currentSongIndex + " - Current Index" + nextSongIndex + " - Next Index"
    );
    dispatch(setNextSong(data.filePaths[nextSongIndex]));
  }, [currentSong]);
  return (
    <div>
      {data.songs && data.songs.length > 0 ? (
        data.songs.map((song: { songData: ShortcutTags }, index: any) => (
          <button onClick={() => handleSelectSong(index)}>
            {song.songData.artist}-{song.songData.title}
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
