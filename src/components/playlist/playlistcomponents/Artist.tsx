import { ShortcutTags } from "jsmediatags/types";
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { Data } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";
import Album from "./Album";
import Select from "react-select";
import ContextMenu from "../ContextMenu";
type artistSongs = {
  artistSongs: {
    songData: ShortcutTags;
    filePath: string;
  }[];
};
interface ArtistProps {
  data: Data;
  artist: string | undefined;
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

const Artist: React.FC<ArtistProps> = ({
  data,
  artist,
  artistSongs,
  startIndex,
  filtered,
}) => {
  // console.log("rerendered" + artist);
  console.log(filtered);
  let albums: any[] = [];
  const [showAlbums, setShowAlbums] = useState(false);
  albums = Array.from(new Set(artistSongs.map((song) => song.songData.album)));
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // console.log(x);
  });
  console.log(artist);
  console.log(albums);
  let albumIndex = startIndex;
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
  return (
    <div className="artist-container">
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
        className="artist-name"
        onClick={() => setShowAlbums((prevShowAlbums) => !prevShowAlbums)}
      >
        {artistSongs.find(
          (song) =>
            song.songData.artist?.toLowerCase() === artist?.toLowerCase()
        )?.songData.artist || "No artist"}
      </h2>
      {showAlbums &&
        albums.map((album) => {
          const albumStartIndex = albumIndex;
          albumIndex += artistSongs.filter(
            (song) => song.songData.album === album
          ).length;
          return (
            <div>
              <button
                onClick={(event) =>
                  handleContextMenu(event, startIndex, artist, album)
                }
              >
                ASS WE CAN
              </button>
              <Album
                key={album}
                data={data}
                album={album}
                startIndex={startIndex}
                artistSongs={artistSongs}
                filtered={filtered}
              />
            </div>
          );
        })}
    </div>
  );
};

export default memo(Artist);
