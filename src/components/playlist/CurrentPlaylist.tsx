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
type Playlist = {
  data: Data;
  currentPlaylist: string;
};

const CurrentPlaylist = ({ data, currentPlaylist }: Playlist) => {
  console.log("Playlist component re-rendered");
  const dispatch = useDispatch();
  function handleSelectSong(index: number) {
    dispatch(setCurrentSongIndex(index));
    dispatch(setCurrentSong(data.songs[index].filePath));
  }

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
  const [filtered, setFiltered] = useState<
    {
      songData: ShortcutTags;
      filePath: string;
    }[]
  >([]);

  useEffect(() => {
    if (
      Array.isArray(data.songs) &&
      Array.isArray(data.albumArtworks) &&
      data.albumArtworks.length > 0
    ) {
      window.localStorage.setItem("MY_APP_STATE", JSON.stringify(data));
      console.log("saved");
    }
    if (data.songs.map((song) => !song.playlist.includes(currentPlaylist))) {
      const n = data.songs.map((song) => {
        return { ...song, playlist: [...song.playlist, currentPlaylist] };
      });
      data.songs = n;
      console.log("asss" + data.songs);
    }
    //   setFiltered(filtered);
  }, [data]);

  localStorage.clear();
  useEffect(() => {
    let filtered = data.songs.sort((a, b) => {
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
    filtered = filtered.filter(
      (song) => song.playlist && song.playlist.includes(currentPlaylist)
    );
    setFiltered(filtered);
  }, [data, currentPlaylist]);

  useEffect(() => {
    const storedData: Data = JSON.parse(
      window.localStorage.getItem("MY_APP_STATE") || "[]"
    );

    if (storedData !== null) setData(storedData);
    if (!data.songs?.length && storedData.albumArtworks) {
      data.songs = storedData.songs;
      data.albumArtworks = storedData.albumArtworks;
      console.log("check");
    }

    console.log(data);
    console.log(storedData);
  }, []);

  console.log(data.songs);

  const [displayByArtist, setDisplayByArtist] = useState(false);

  const artists = Array.from(
    new Set(
      filtered.map((song) => {
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
      <button onClick={() => setDisplayByArtist((prevDisplay) => !prevDisplay)}>
        {displayByArtist ? "Display by songs" : "Display by artist"}
      </button>
      <div className="songs-container">
        {displayByArtist
          ? artists.map((artist, index) => {
              const artistSongs = filtered.filter(
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
            })
          : filtered.map((song, index) => {
              return (
                <div>
                  <div className="song-details">
                    <div
                      className="song-artist"
                      key={index}
                      onClick={() => {
                        handleSelectSong(index);
                      }}
                    >
                      {song.songData.artist} - {song.songData.title} -{" "}
                      {song.songData.album}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
const mapDispatchToProps = {
  setCurrentSong,
  setCurrentSongIndex,
};
function mapStateToProps(state: AppState) {
  return {
    currentPlaylist: state.audio.currentPlaylist,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentPlaylist);
