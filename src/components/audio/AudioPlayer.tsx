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
  useEffect(() => {
    console.log(filtered);
  }, [setFiltered]);

  let previousSongIndex = currentSongIndex - 1;

  useEffect(() => {
    let filtered = filteredSongs.filter(
      (song) => song.playlists && song.playlists.includes(currentPlaylist)
    );

    if (isShuffled) {
      let filteredShuffle = [...filtered];
      filteredShuffle.splice(currentSongIndex, 1);
      filteredShuffle.sort(() => Math.random() - 0.5);

      if (currentSongIndex === filtered.length) {
        filteredShuffle.unshift(filtered[filtered.length - 1]);
      } else {
        filteredShuffle.unshift(filtered[currentSongIndex]);
      }
      console.log("FILTERED SHUFFLE", filteredShuffle);
      dispatch(setNextSong(filteredShuffle[1].filePath));

      setFiltered(filteredShuffle);
      dispatch(setNextSongIndex(1));

      // Add a check to prevent changing the song when shuffle is toggled
      if (currentSong === "" && !isNewSongSelected) {
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
      dispatch(setNextSong(filtered[nextSongIndex].filePath));
    }
    play();
  }, [currentSongIndex, filtered]);
  useEffect(() => {
    console.log(
      filtered,
      "ASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
    );
    if (audioElement.current) {
      console.log("CURRENT SONG INDEX", currentSongIndex);
      console.log(currentSong);
      if (currentSong)
        audioElement.current.src = `media-loader://${currentSong}`;
      audioElement.current.volume = defaultVolume;
      audioElement.current.play();
      play();

      /* if (
        filtered.length > 0 &&
        currentSongIndex >= 0 &&
        currentSongIndex < filtered.length
      ) {
        dispatch(setCurrentSong(filtered[currentSongIndex].filePath));
      } */
    }
  }, [currentSongIndex, currentSong, filtered]);
  return (
    <div className="audio-player">
      <audio ref={audioElement} />
      <PlayPauseButton audioElement={audioElement} />
      <ProgressBar audioElement={audioElement} />
      <VolumeControl defaultValue={defaultVolume} audioElement={audioElement} />
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
