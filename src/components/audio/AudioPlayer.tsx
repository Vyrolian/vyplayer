import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { pause, play, shuffle } from "../../actions/audio/audio";

import { connect, useDispatch, useSelector } from "react-redux";
import { setVolume } from "../../actions/audio/SetVolume";
import { AppState } from "../../../types/AppState";
import { Data, FilteredSongs } from "../../../types/songMetadata";
import { setUseProxies } from "immer";
import { set } from "immer/dist/internal";
import "./AudioPlayer.css";
import {
  setCurrentSong,
  setCurrentSongIndex,
  setNextSong,
  setPreviousSong,
} from "../../actions/audio/setSong";

import { filteredByCurrentPlaylist } from "../functions/playlist/filteredByCurrentPlaylist";
import { audioElement } from "../../constants/audio/audioElement";

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
}: AudioPlayerProps) {
  const [filtered, setFiltered] = useState<FilteredSongs>([]);

  useEffect(() => {
    let filtered;
    filtered = filteredSongs.filter(
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
    );
    console.log("UNSHUFFLED", filtered);
    let filteredShuffle = [...filtered];
    console.log(isShuffled);
    if (isShuffled) {
      // Find index of current song

      // Remove current song from array
      filteredShuffle.splice(currentSongIndex, 1);
      // Shuffle remaining songs
      filteredShuffle.sort(() => Math.random() - 0.5);
      //console.log(currentSongIndex);
      //console.log(filtered.length - 1);
      if (currentSongIndex === filtered.length) {
        filteredShuffle.unshift(filtered[filtered.length - 1]);
      } else {
        filteredShuffle.unshift(filtered[currentSongIndex]);
      }
      dispatch(setCurrentSongIndex(0));

      setFiltered(filteredShuffle);

      console.log("SHUFFLED SONGS", filteredShuffle);
      if (currentSong == "") {
        filteredShuffle.sort(() => Math.random() - 0.5);
        const firstSong = filteredShuffle[0];
        dispatch(setCurrentSong(firstSong.filePath));
        play();
        dispatch(setCurrentSongIndex(0));
      }
    } else {
      setFiltered(filtered);
    }
  }, [currentPlaylist, filteredSongs, isShuffled, isNewSongSelected]);
  // console.log(filtered);
  // console.log(currentSong);
  // console.log("Filtered songs: ", filteredSongs);
  const storedVolume = localStorage.getItem("volume");
  let defaultVolume: number;
  storedVolume
    ? (defaultVolume = parseFloat(storedVolume))
    : (defaultVolume = 0.1);

  const dispatch = useDispatch();
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;

  useEffect(() => {
    if (!audioElement) return;
    if (currentSong) {
      audioElement.src = `media-loader://${currentSong}`;
      audioElement.volume = defaultVolume;
      audioElement.play();
      let previousSongIndex = currentSongIndex - 1;
      let nextSongIndex = currentSongIndex + 1;
      //  dispatch(setCurrentSongIndex(currentSongIndex + 1));

      if (nextSongIndex >= filtered.length) {
        console.log(nextSongIndex);
        nextSongIndex = 0;
        dispatch(setNextSong(filtered[nextSongIndex].filePath));
        // dispatch(setCurrentSongIndex(-1));
      }
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
        dispatch(setNextSong(filtered[nextSongIndex].filePath));
      }

      play();
    } else {
      audioElement.src = ""; // Set the src to an empty string
    }
  }, [currentSong, currentSongIndex, isShuffled, isNewSongSelected]);
  return (
    <div className="audio-player">
      <audio id="audio-element" />
      <PlayPauseButton audioElement={audioElement} />
      <ProgressBar />
      <VolumeControl defaultValue={defaultVolume} />
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
