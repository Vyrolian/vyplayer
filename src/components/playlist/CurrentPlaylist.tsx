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
import { Playlist } from "../../../types/playlist/SetPlaylists";
import Select from "react-select";
import ContextMenu from "./ContextMenu";
type CurrentPlaylist = {
  data: Data;
  currentPlaylist: string;
  playlists: Playlist;
};

const CurrentPlaylist = ({
  data,
  currentPlaylist,
  playlists,
}: CurrentPlaylist) => {
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
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
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

  function handleAddToPlaylist(index: number, playlistName: string) {
    const song = data.songs[index];
    if (!song.playlists) {
      song.playlists = [playlistName];
    } else if (!song.playlists.includes(playlistName)) {
      song.playlists.push(playlistName);
    }
    const newData = { ...data };
    setData(newData);
  }
  // console.log(artists);
  const options = playlists.map((playlist) => ({
    value: playlist.name,
    label: playlist.name,
  }));
  let startIndex = 0;

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    // show the context menu at (x, y)
  });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);
  console.log(contextMenu);
  function handleContextMenu(event: React.MouseEvent, index: number) {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, index: index });
    console.log(event.clientX);
  }
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // console.log(x);
  });
  function handleCloseContextMenu() {
    setContextMenu(null);
  }

  return (
    <div style={{ height: "1200px", overflowY: "auto" }}>
      <div>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            index={contextMenu.index}
            onClose={handleCloseContextMenu}
            songs={data.songs}
          />
        )}
        {/* rest of the component */}
      </div>
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
                <div onContextMenu={(event) => handleContextMenu(event, index)}>
                  <Artist
                    key={index}
                    data={data}
                    artist={artist}
                    startIndex={artistStartIndex}
                    artistSongs={artistSongs}
                  />
                </div>
              );
            })
          : filtered.map((song, index) => {
              return (
                <div
                  key={index}
                  onContextMenu={(event) => handleContextMenu(event, index)}
                >
                  <div className="song-details">
                    {/* display the song details */}
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
    playlists: state.audio.playlists,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CurrentPlaylist);
