import { ShortcutTags } from "jsmediatags/types";
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { Data } from "../../../../types/songMetadata";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../../actions/audio/setSong";
import Album from "./Album";
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
}

const Artist: React.FC<ArtistProps> = ({
  data,
  artist,
  artistSongs,
  startIndex,
}) => {
  console.log("rerendered" + artist);
  let albums: any[] = [];

  albums = Array.from(new Set(artistSongs.map((song) => song.songData.album)));

  console.log(artist);
  console.log(albums);
  let albumIndex = startIndex;

  return (
    <div className="artist-container">
      <h2 className="artist-name">
        {artistSongs.find(
          (song) =>
            song.songData.artist?.toLowerCase() === artist?.toLowerCase()
        )?.songData.artist || "No artist"}
      </h2>
      {albums.map((album) => {
        const albumStartIndex = albumIndex;
        albumIndex += artistSongs.filter(
          (song) => song.songData.album === album
        ).length;
        return (
          <Album
            key={album}
            data={data}
            album={album}
            startIndex={albumStartIndex}
            artistSongs={artistSongs}
          />
        );
      })}
    </div>
  );
};

export default memo(Artist);
