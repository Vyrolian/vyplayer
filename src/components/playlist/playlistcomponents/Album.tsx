import { ShortcutTags } from "jsmediatags/types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Data } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";
import ContextMenu from "../ContextMenu";

interface AlbumProps {
  album: string | undefined;
  data: Data;
  artistSongs: {
    songData: ShortcutTags;
    filePath: string;
  }[];
  startIndex: number;
  filtered: {
    songData: ShortcutTags;
    filePath: string;
    playlists: string[];
  }[];
}

const Album: React.FC<AlbumProps> = React.memo(
  ({ data, album, startIndex, artistSongs, filtered }) => {
    const dispatch = useDispatch();
    function handleSelectSong(index: number) {
      dispatch(setCurrentSongIndex(index));
      dispatch(setCurrentSong(filtered[index].filePath));
      console.log(artistSongs);
    }
    let imageSrc = "No picture";
    // console.log(album);
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
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      index: number;
      artist: string | undefined;
      album: string | undefined;
    } | null>(null);
    console.log(contextMenu);
    function handleContextMenu(
      event: React.MouseEvent,
      index: number,
      artist: string | undefined,
      album: string | undefined
    ) {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        index: index,
        artist: artist,
        album: album,
      });
      console.log(event.clientX);
    }
    function handleCloseContextMenu() {
      setContextMenu(null);
    }

    // console.log(imageSrc);
    let counter = startIndex;
    const [showSongs, setShowSongs] = useState(false);
    return (
      <div className="album-container">
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            index={contextMenu.index}
            onClose={handleCloseContextMenu}
            songs={data.songs}
            artist={contextMenu.artist}
            album={contextMenu.album}
            onSongsRemoved={() => {}}
          />
        )}
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
              .map((song) => {
                const currentIndex = filtered.findIndex(
                  (filteredSong) => filteredSong.filePath === song.filePath
                );
                return (
                  <li
                    key={currentIndex}
                    onClick={() => handleSelectSong(currentIndex)}
                  >
                    {song.songData.title} - {currentIndex}{" "}
                    <button
                      onClick={(event) =>
                        handleContextMenu(
                          event,
                          currentIndex,
                          undefined,
                          undefined
                        )
                      }
                    ></button>
                  </li>
                );
              })}
        </ul>
      </div>
    );
  }
);
export default Album;
