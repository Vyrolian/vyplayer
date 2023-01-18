import { ShortcutTags, TagType } from "jsmediatags/types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { SetCurrentSong } from "../../../types/audio/SetCurrentSong";
import { setCurrentSong } from "../../actions/audio/setCurrentSong";
var jsmediatags = window.jsmediatags;
type Playlist = {
  file: File | null;
  songData: ShortcutTags;
};
type file = {
  file: File | null;
};
function Playlist({ setCurrentSong }: any) {
  const [songs, setSongs] = useState<Playlist[]>(
    JSON.parse(localStorage.getItem("songs") || "[]")
  );

  function handleAddSong(file: File | null) {
    // Use jsmediatags library to read the file's metadata

    if (file) {
      jsmediatags.read(file, {
        onSuccess: (metadata: TagType) => {
          const song: Playlist = {
            file,
            songData: metadata.tags,
          };
          setSongs([...songs, song]);
          localStorage.setItem("songs", JSON.stringify([...songs, song]));
        },
        onError: (error: any) => {
          console.error(error);
        },
      });
    }
  }
  function handleSelectSong(index: number) {
    // Dispatch action to update currentsong state in store
    console.log(songs[index] + "ass");
    setCurrentSong(songs[index]);
  }
  function handleRemoveSong(index: number) {
    const newSongs = [...songs];
    newSongs.splice(index, 1);
    setSongs(newSongs);
    localStorage.setItem("songs", JSON.stringify(newSongs));
  }

  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song.songData.title}
            <button onClick={() => handleRemoveSong(index)}>Remove</button>
            <button onClick={() => handleSelectSong(index)}>Add</button>
          </li>
        ))}
      </ul>
      <input
        type="file"
        onChange={(e) =>
          e.target.files?.[0] && handleAddSong(e.target.files[0])
        }
      />
    </div>
  );
}
const mapDispatchToProps = {
  setCurrentSong,
};
export default connect(null, mapDispatchToProps)(Playlist);
