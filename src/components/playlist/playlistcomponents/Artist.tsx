import { ShortcutTags } from "jsmediatags/types";
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { Data, FilteredSongs } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";
import Album from "./Album";
import Select from "react-select";
import ContextMenu from "../../contextmenu/ContextMenu";
import { SetContextMenu } from "../../../../types/playlist/ContextMenu";
import { extractAlbums } from "../../functions/playlist/extract/extractAlbums";

interface ArtistProps {
  artist: string | undefined;
  artistSongs: FilteredSongs;
  startIndex: number;
  filtered: FilteredSongs;
}

const Artist: React.FC<ArtistProps> = ({
  artist,
  artistSongs,
  startIndex,
  filtered,
}) => {
  // console.log("rerendered" + artist);
  console.log(filtered);
  let albums: any[] = [];
  const [showAlbums, setShowAlbums] = useState(false);
  albums = extractAlbums(artistSongs);

  // console.log(x);
  console.log(artist);
  console.log(albums);
  let albumIndex = startIndex;
  const [contextMenu, setContextMenu] = useState<SetContextMenu | null>(null);
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
          songs={filtered}
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
                CONTEXTMENU
              </button>
              <Album
                key={album}
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
