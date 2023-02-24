import { ShortcutTags } from "jsmediatags/types";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Data } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";

import ContextMenu from "../ContextMenu";
import { extractAlbums } from "../../functions/playlist/extract/extractAlbums";
interface AlbumProps {
  album: string | undefined;

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
  ({ album, startIndex, artistSongs, filtered }) => {
    const dispatch = useDispatch();
    function handleSelectSong(index: number) {
      dispatch(setCurrentSongIndex(index));
      dispatch(setCurrentSong(filtered[index].filePath));
      console.log(artistSongs);
    }

    // console.log(album);

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
    let picture;
    if (album) picture = album.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_");
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
            songs={filtered}
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
          <img
            src={`media-loader://C:/test/${picture}.jpeg`}
            style={{ width: 150 }}
            alt={album}
          />
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
