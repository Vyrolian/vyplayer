import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AppState, AudioState, Track } from "../../../types/AppState";
function updateMetadataFromAudioElement(title: string) {
  const audioElement = document.getElementById(
    "audio-element"
  ) as HTMLAudioElement;
  title = audioElement.title;
  return <div></div>;
}

const mapStateToProps = (state: AppState) => ({
  title: state.audio.currentTrack.title,
});
const ConnectedComponent = connect(mapStateToProps)(
  updateMetadataFromAudioElement
);
