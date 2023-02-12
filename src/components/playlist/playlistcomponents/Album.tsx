import { ShortcutTags } from "jsmediatags/types";
import React from "react";
import { useDispatch } from "react-redux";
import { Data } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";

interface AlbumProps {
  album: string | undefined;
  data: Data;
  artistSongs: {
    songData: ShortcutTags;
    filePath: string;
  }[];
  startIndex: number;
}

const Album: React.FC<AlbumProps> = React.memo(
  ({ data, album, startIndex, artistSongs }) => {
    const dispatch = useDispatch();
    function handleSelectSong(index: number) {
      dispatch(setCurrentSongIndex(index));
      dispatch(setCurrentSong(data.songs[index].filePath));
    }
    let counter = startIndex;
    return (
      <div className="album-container">
        <h2 className="album-name">{album}</h2>
        <ul className="songs-list">
          {artistSongs
            .filter((song) => song.songData.album === album)
            .map((song, index) => {
              const currentIndex = counter;
              counter += 1;
              return (
                <li
                  key={currentIndex}
                  onClick={() => handleSelectSong(currentIndex)}
                >
                  {song.songData.title} - {currentIndex}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
);
export default Album;
