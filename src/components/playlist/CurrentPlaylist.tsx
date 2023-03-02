import { PictureType, ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, { useContext, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../actions/audio/setSong";
import { Data, FilteredSongs } from "../../../types/songMetadata";
import { AppState } from "../../../types/AppState";
import Artist from "./playlistcomponents/Artist";
import { Playlist } from "../../../types/playlist/SetPlaylists";
import { SetContextMenu } from "../../../types/playlist/ContextMenu";
import Select from "react-select";
import ContextMenu from "./ContextMenu";
import { filteredSongs } from "../functions/playlist/sorting/filteredSongs";

import { extractUniqueArtist } from "../functions/playlist/extract/extractUniqueArtist";

type CurrentPlaylist = {
  currentPlaylist: string;
  playlists: Playlist;
  filteredSongs: FilteredSongs;
  deletedPlaylist: string;
};

const CurrentPlaylist = ({
  currentPlaylist,
  playlists,
  filteredSongs,
  deletedPlaylist,
}: CurrentPlaylist) => {
  const [updatedFilteredSongs, setUpdatedFilteredSongs] =
    useState(filteredSongs);

  useEffect(() => {
    setUpdatedFilteredSongs(filteredSongs);
    const updatedSongs = filteredSongs.map((song) => {
      const playlists = song.playlists.filter(
        (playlist) => playlist !== deletedPlaylist
      );
      return { ...song, playlists };
    });
    setUpdatedFilteredSongs(updatedSongs);
  }, [filteredSongs, deletedPlaylist]);
  // console.log(updatedFilteredSongs);
  // console.log("Playlist component re-rendered");
  const dispatch = useDispatch();

  function handleSelectSong(index: number) {
    dispatch(setCurrentSongIndex(index));
    dispatch(setCurrentSong(filtered[index].filePath));
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
      playlists: string[];
    }[]
  >([]);

  // LOCAL STORAGE
  /* useEffect(() => {
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

    //console.log(data);
    //  console.log(storedData);
  }, []);
  localStorage.clear(); */
  const [displayByArtist, setDisplayByArtist] = useState(false);
  // FILTER
  const [songRemoved, setSongRemoved] = useState<boolean>(false);
  function handleSongsRemoved() {
    setSongRemoved((prevSongRemoved) => !prevSongRemoved);
    // update the playlist state here
    // this will trigger the useEffect
  }
  useEffect(() => {
    filteredSongs = filteredSongs.filter(
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
    );

    setFiltered((prevFiltered) => filteredSongs);
  }, [filteredSongs, currentPlaylist, songRemoved]);
  //

  //console.log("FILTERED SONGS", filtered);

  const artists = extractUniqueArtist(filtered);

  // CONTEXT MENU
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
  const [contextMenu, setContextMenu] = useState<SetContextMenu | null>(null);
  console.log(contextMenu);
  function handleContextMenu(
    event: React.MouseEvent,
    index: number,
    artist: string | undefined
  ) {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      index: index,
      artist: artist,
      album: undefined,
    });
    console.log(event.clientX);
  }
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // console.log(x);
  });
  function handleCloseContextMenu() {
    setContextMenu(null);
  }
  useEffect(() => {
    console.log(filtered);
  }, [displayByArtist]);
  return (
    <div style={{ height: "1200px", overflowY: "auto" }}>
      <div>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            index={contextMenu.index}
            onClose={handleCloseContextMenu}
            songs={filtered}
            artist={contextMenu.artist}
            onSongsRemoved={handleSongsRemoved}
          />
        )}

        {/* rest of the component */}
      </div>
      <button onClick={() => setDisplayByArtist((prevDisplay) => !prevDisplay)}>
        {displayByArtist ? "Display by songs" : "Display by artist"}
      </button>
      <div className="songs-container">
        {displayByArtist
          ? //FILTERED BY ARTIST
            artists.map((artist, index) => {
              const artistSongs = filtered.filter(
                (song) =>
                  song.songData.artist?.toLowerCase().split("/")[0] === artist
              );
              console.log(artistSongs);
              const artistStartIndex = startIndex;
              startIndex += artistSongs.length;
              return (
                <div>
                  <button
                    onClick={(event) => handleContextMenu(event, index, artist)}
                  >
                    CONTEXTMENU
                  </button>
                  <Artist
                    key={index}
                    artist={artist}
                    startIndex={artistStartIndex}
                    artistSongs={artistSongs}
                    filtered={filtered}
                  />
                </div>
              );
            })
          : //FILTERED BY SONGS
            filtered.map((song, index) => {
              return (
                <div
                  key={index}
                  onContextMenu={(event) =>
                    handleContextMenu(event, index, undefined)
                  }
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

function mapStateToProps(state: AppState) {
  return {
    currentPlaylist: state.audio.currentPlaylist,
    playlists: state.audio.playlists,
    deletedPlaylist: state.audio.deletedPlaylist,
  };
}
export default connect(mapStateToProps, null)(CurrentPlaylist);
