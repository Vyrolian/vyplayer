import { PictureType, ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../actions/audio/setSong";
import { Data } from "../../../types/songMetadata";
import { AppState } from "../../../types/AppState";
import Artist from "./playlistcomponents/Artist";
import { openDB } from "idb";
type Playlist = {
  data: Data;
};

const Playlist = React.memo(({ data }: Playlist) => {
  console.log("Playlist component re-rendered");

  const [data1, setData] = useState<{
    albumArtworks: Array<{
      album: string;
      picture: PictureType;
    }>;
    songs: {
      songData: ShortcutTags;
      filePath: string;
    }[];
  }>();
  useEffect(() => {
    if (data && data.songs.length > 0) {
      window.localStorage.setItem("MY_APP_STATE", JSON.stringify(data));
      console.log("saved");
    }
  }, [data]);
  let adata = {};
  useEffect(() => {
    const storedData: Data = JSON.parse(
      window.localStorage.getItem("MY_APP_STATE") || "[]"
    );
    if (storedData !== null) setData(storedData);
    if (data.songs.length == 0) {
      data.songs = storedData.songs;
      data.albumArtworks = storedData.albumArtworks;
      console.log("check");
    }
    console.log(data);
    console.log(storedData);
  }, []);

  console.log(data.songs);
  data.songs.sort((a, b) => {
    // if artist is not defined, move the song to the top
    if (!a.songData.artist) return -1;
    if (!b.songData.artist) return 1;

    // convert artist names to lowercase for comparison
    const aArtist = a.songData.artist.toLowerCase();
    const bArtist = b.songData.artist.toLowerCase();

    // if the artist names are the same or one starts with the other + "/"
    if (
      aArtist === bArtist ||
      bArtist.startsWith(aArtist + "/") ||
      aArtist.startsWith(bArtist + "/")
    ) {
      // if album is not defined, move the song to the top
      if (!a.songData.album) return -1;
      if (!b.songData.album) return 1;
      // compare the album names
      return a.songData.album.localeCompare(b.songData.album);
    }
    if (aArtist === undefined) {
    }
    // compare the artist names
    return aArtist.localeCompare(bArtist);
  });

  const artists = Array.from(
    new Set(
      data.songs.map((song) => {
        return (
          song.songData.artist &&
          song.songData.artist.split("/")[0].toLowerCase()
        );
      })
    )
  );

  // console.log(artists);
  let startIndex = 0;
  return (
    <div>
      <div className="songs-container">
        {artists.map((artist, index) => {
          const artistSongs = data.songs.filter(
            (song) =>
              song.songData.artist?.toLowerCase().split("/")[0] === artist
          );
          console.log(artistSongs);
          const artistStartIndex = startIndex;
          startIndex += artistSongs.length;
          return (
            <Artist
              key={index}
              data={data}
              artist={artist}
              startIndex={artistStartIndex}
              artistSongs={artistSongs}
            />
          );
        })}
      </div>
    </div>
  );
});
const mapDispatchToProps = {
  setCurrentSong,
  setCurrentSongIndex,
};

export default connect(null, mapDispatchToProps)(Playlist);
