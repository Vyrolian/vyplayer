import React, { useEffect, useState } from "react";
import PlayPauseButton from "./audiocomponents/PlayPauseButton";
import ProgressBar from "./audiocomponents/ProgressBar";
import VolumeControl from "./audiocomponents/VolumeControl";
import SongMetadata from "./audiocomponents/SongMetadata";
import { next, pause, play, shuffle } from "../../actions/audio/audio";

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
  setNextSongIndex,
  setPreviousSong,
} from "../../actions/audio/setSong";

import { filteredByCurrentPlaylist } from "../functions/playlist/filteredByCurrentPlaylist";
import { audioElement } from "../../constants/audio/audioElement";
import { setPlaylistLength } from "../../actions/playlist/setPlaylistLength";

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
}: AudioPlayerProps) {
  const [filtered, setFiltered] = useState<FilteredSongs>([]);
  let previousSongIndex = currentSongIndex - 1;

  useEffect(() => {
    let filtered = filteredSongs.filter(
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
    );
    console.log("UNSHUFFLED", filtered);
    let filteredShuffle = [...filtered];
    console.log(isShuffled);
    if (isShuffled === true) {
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
      // dispatch(setCurrentSongIndex(0));
      console.log(filteredShuffle[1].filePath);
      dispatch(setNextSong(filteredShuffle[1].filePath));
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
    dispatch(setPlaylistLength(filtered.length));
    console.log("ASS", filteredSongs);
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
    //  dispatch(setCurrentSongIndex(currentSongIndex + 1));
    console.log(filtered.length);

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
      dispatch(setNextSong(filtered[nextSongIndex].filePath));
    }
    play();
  }, [currentSongIndex, isShuffled, isNewSongSelected]);
  useEffect(() => {
    if (!audioElement) return;
    console.log("CURRENT SONG INDEX", currentSongIndex);
    console.log(currentSong);
    if (currentSong) audioElement.src = `media-loader://${currentSong}`;
    audioElement.volume = defaultVolume;
    audioElement.play();
    play();
    dispatch(setCurrentSong(filtered[currentSongIndex].filePath));
  }, [currentSongIndex, currentSong]);
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
    nextSongIndex: state.audio.nextSongIndex,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
