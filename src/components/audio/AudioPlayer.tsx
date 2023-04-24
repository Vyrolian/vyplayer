import React, { useEffect, useRef, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { next, pause, play, shuffle } from "../../actions/audio/audio";

import { connect, useDispatch, useSelector } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";
import { Data, FilteredSongs } from "../../../types/songMetadata";

import "./AudioPlayer.css";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setCurrentSongInfo,
  setNextSong,
  setNextSongIndex,
  setPreviousSong,
} from "../../actions/audio/setSong";

import { filteredByCurrentPlaylist } from "../functions/playlist/filteredByCurrentPlaylist";
import { audioElement } from "../../constants/audio/audioElement";
import { setPlaylistLength } from "../../actions/playlist/setPlaylistLength";
import audio from "../../reducers/audio/audio";

//import test from "./test.mp3";
type AudioPlayerProps = {
  play: typeof play;
  pause: typeof pause;
  setVolume: typeof setVolume;
  filteredSongs: FilteredSongs;
  currentSong: string;
  currentSongIndex: number;
  currentPlaylist: string;
  isShuffled: boolean;
  isNewSongSelected: boolean;
  nextSongIndex: number;
  isPlaying: boolean;
  currentSongTitle: string;
  currentSongArtist: string;
};

function AudioPlayer({
  filteredSongs,
  play,
  pause,
  currentSong,
  currentSongIndex,
  currentPlaylist,
  isShuffled,
  isNewSongSelected,
  nextSongIndex,
  isPlaying,
  currentSongTitle,
  currentSongArtist,
}: AudioPlayerProps) {
  const dispatch = useDispatch();
  const [filtered, setFiltered] = useState<FilteredSongs>([]);
  useEffect(() => {
    console.log(filtered);
  }, [setFiltered]);

  let previousSongIndex = currentSongIndex - 1;

  useEffect(() => {
    let filtered = filteredSongs.filter(
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
    );

    if (isShuffled) {
      let shuffledFiltered = shuffleArray(filtered, currentSongIndex);
      setFiltered(shuffledFiltered);
      dispatch(setNextSongIndex(1));
    } else {
      // Find the index of the current song in the filtered playlist
      const currentSongInFilteredIndex = filtered.findIndex(
        (song) => song.filePath === currentSong
      );

      setFiltered(filtered);

      // Set nextSongIndex based on the current song's index in the filtered playlist
      if (currentSongInFilteredIndex !== -1) {
        const nextSongIndexInFiltered =
          (currentSongInFilteredIndex + 1) % filtered.length;

        dispatch(setNextSongIndex(nextSongIndexInFiltered));
      }
    }

    dispatch(setPlaylistLength(filtered.length));
  }, [currentPlaylist, filteredSongs, isShuffled]);
  // Utility function to shuffle an array
  function shuffleArray(array: any[], currentSongIndex: number) {
    let newArr = [...array];
    // Remove the current song from the array
    newArr.splice(currentSongIndex, 1);

    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }

    // Insert the current song at the beginning of the shuffled array
    newArr.unshift(array[currentSongIndex]);
    console.log(newArr, "asswecan");
    return newArr;
  }

  // console.log(filtered);
  // console.log(currentSong);
  // console.log("Filtered songs: ", filteredSongs);
  const storedVolume = localStorage.getItem("volume");
  let defaultVolume: number;
  storedVolume
    ? (defaultVolume = parseFloat(storedVolume))
    : (defaultVolume = 0.1);

  const audioElement = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    //  dispatch(setCurrentSongIndex(currentSongIndex + 1));
    console.log(filtered.length);
    console.log(filtered);
    if (currentSongIndex == 0) {
      previousSongIndex = 0;
    }
    if (currentSongIndex == filtered.length) {
      dispatch(setCurrentSongIndex(0));
    }
    console.log(
      previousSongIndex +
        " - Previous Index " +
        currentSongIndex +
        " - Current Index " +
        nextSongIndex +
        " - Next Index "
    );
    if (previousSongIndex >= 0 && previousSongIndex < filtered.length) {
      dispatch(setPreviousSong(filtered[previousSongIndex].filePath));
      //
    }
    if (nextSongIndex != filtered.length && filtered.length > 0) {
      console.log(filtered);
      if (filtered[nextSongIndex]) {
        dispatch(setNextSong(filtered[nextSongIndex].filePath));
      } else {
        console.error("No song found at nextSongIndex:", nextSongIndex);
      }
    }
    //play();
  }, [currentSongIndex, filtered]);

  useEffect(() => {
    if (audioElement.current) {
      console.log("CURRENT SONG INDEX", currentSongIndex);
      console.log(currentSong);
      if (currentSong)
        audioElement.current.src = `media-loader://${currentSong}`;
      audioElement.current.volume = defaultVolume;
      audioElement.current.play();

      // play();

      if (
        filtered.length > 0 &&
        currentSongIndex >= 0 &&
        currentSongIndex < filtered.length
      ) {
        dispatch(setCurrentSong(filtered[currentSongIndex].filePath));
        dispatch(
          setCurrentSongInfo(
            filtered[currentSongIndex]?.songData?.title || "Unknown Title",
            filtered[currentSongIndex]?.songData?.artist || "Unknown Artist"
          )
        );
      }
    }
  }, [currentSongIndex, currentSong]);
  let currentSongData = filtered.find((song) => song.filePath === currentSong);

  let picture;
  if (currentSongData?.songData.album)
    picture = currentSongData?.songData.album.replace(
      /[<>:"\/\\|?*\x00-\x1F]/g,
      "_"
    );
  return (
    <div className="audio-player">
      <div className="song-info">
        <div className="song-image-container">
          <img
            src={`media-loader://C:/test/${picture}.jpeg`}
            style={{
              width: "63px",
            }}
          />
        </div>
        <div className="song-text-container">
          <div className="song-title" style={{ color: "#4B52FB" }}>
            {currentSongTitle}
          </div>
          <div className="song-artist">{currentSongArtist}</div>
        </div>
      </div>
      <audio ref={audioElement} />
      <PlayPauseButton audioElement={audioElement} />
      <ProgressBar audioElement={audioElement} />
      <div className="volume-control-wrapper">
        <VolumeControl
          defaultValue={defaultVolume}
          audioElement={audioElement}
        />
      </div>
    </div>
  );
}

const mapDispatchToProps = { play, pause, setVolume };
function mapStateToProps(state: AppState) {
  return {
    nextSong: state.audio.nextSong,
    volume: state.audio.volume,
    currentSong: state.audio.currentSong,
    currentSongIndex: state.audio.currentSongIndex,
    currentPlaylist: state.audio.currentPlaylist,
    isShuffled: state.audio.isShuffled,
    isNewSongSelected: state.audio.isNewSongSelected,
    nextSongIndex: state.audio.nextSongIndex,
    isPlaying: state.audio.isPlaying,
    currentSongTitle: state.audio.currentSongTitle,
    currentSongArtist: state.audio.currentSongArtist,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
