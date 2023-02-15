import { ShortcutTags } from "jsmediatags/types";
import React, { useState } from "react";
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
    let imageSrc = "No picture";
    console.log(album);
    data.albumArtworks.map((albumArtwork) => {
      if (
        albumArtwork.album === album &&
        albumArtwork.picture &&
        albumArtwork.picture.data
      ) {
        // convert the album artwork data to a base64 encoded string

        const { data, format } = albumArtwork.picture;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        imageSrc = `data:${format};base64,${window.btoa(base64String)}`;
        return;
      }
    });
    // console.log(imageSrc);
    let counter = startIndex;
    const [showSongs, setShowSongs] = useState(false);
    return (
      <div className="album-container">
        <h2
          className="album-name"
          onClick={() => setShowSongs((prevState) => !prevState)}
        >
          {album}
        </h2>
        <div className="album-artwork">
          <img src={imageSrc} style={{ width: 150 }} alt={album} />
        </div>
        <ul className="songs-list">
          {showSongs &&
            artistSongs
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
