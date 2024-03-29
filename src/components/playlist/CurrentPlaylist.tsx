import { PictureType, ShortcutTags, Tags, TagType } from "jsmediatags/types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setCurrentSongInfo,
  setNewSong,
} from "../../actions/audio/setSong";
import {
  Data,
  FilteredSongs,
  ShortcutTagsDuration,
} from "../../../types/songMetadata";
import { AppState } from "../../../types/AppState";
import Artist from "./playlistcomponents/Artist";
import { Playlist } from "../../../types/playlist/SetPlaylists";
import { SetContextMenu } from "../../../types/playlist/ContextMenu";
import Select from "react-select";
import ContextMenu from "../contextmenu/ContextMenu";
import { filteredSongs } from "../functions/playlist/sorting/filteredSongs";
import "./CurrentPlaylist.css";
import { extractUniqueArtist } from "../functions/playlist/extract/extractUniqueArtist";
import { play } from "../../actions/audio/audio";

type CurrentPlaylist = {
  currentPlaylist: string;
  playlists: Playlist;
  filteredSongs: FilteredSongs;
  deletedPlaylist: string;
  play: typeof play;
};

const CurrentPlaylist = ({
  currentPlaylist,
  playlists,
  filteredSongs,
  deletedPlaylist,
  play,
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
    console.log(filtered, "Current Playlist filtered");
    dispatch(setCurrentSong(filtered[index].filePath));

    dispatch(setNewSong());
    play();
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
      songData: ShortcutTagsDuration;
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
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
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

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
    console.log("ass");
  }, []);

  useEffect(() => {
    console.log(filtered);
  }, [displayByArtist]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSongsI = filtered.filter((song) =>
    [song.songData.artist, song.songData.title, song.songData.album].some(
      (value) => value?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  function formatDuration(durationInSeconds: any) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === "f") {
        setShowSearch(true);
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  function handleSearch(event: { key: string }) {
    if (event.key === "Enter" || event.key === "Escape") {
      setShowSearch(false);
      setSearchTerm("");
    }
  }
  return (
    <div style={{ width: "100%" }}>
      <div className="playlist-header">
        <img
          className="playlist-image"
          src={`media-loader://C:/test/Augment.jpeg`}
          alt="playlist"
        />
        <div className="playlist-details">
          {" "}
          {/* Wrap the playlist name and number of tracks */}
          <div className="playlist-name">{currentPlaylist}</div>
          <div className="playlist-tracks">{filtered.length} tracks</div>{" "}
          {/* Add the number of tracks */}
        </div>
        {showSearch && (
          <input
            ref={searchInputRef}
            className="search-input"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            onKeyDown={handleSearch}
          />
        )}
      </div>
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

      <button onClick={() => setDisplayByArtist((prevDisplay) => !prevDisplay)}>
        {displayByArtist ? "Display by songs" : "Display by artist"}
      </button>
      <div className="songs-container">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Artist</th>
              <th>Title</th>
              <th>Album</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .map((song, index) => ({ ...song, originalIndex: index }))
              .filter(
                (song) =>
                  song.songData.artist
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  song.songData.title
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  song.songData.album
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((song) => (
                <tr
                  key={song.originalIndex}
                  onContextMenu={(event) =>
                    handleContextMenu(event, song.originalIndex, undefined)
                  }
                  onClick={() => {
                    handleSelectSong(song.originalIndex);
                  }}
                >
                  <td>{song.originalIndex + 1}</td>
                  <td>{song.songData.artist}</td>
                  <td>{song.songData.title}</td>
                  <td>{song.songData.album}</td>
                  <td>{formatDuration(song.songData.duration)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    currentPlaylist: state.audio.currentPlaylist,
    playlists: state.audio.playlists,
    deletedPlaylist: state.audio.deletedPlaylist,
    isShuffled: state.audio.isShuffled,
  };
}
const mapDispatchToProps = {
  play,
};
export default connect(mapStateToProps, mapDispatchToProps)(CurrentPlaylist);
