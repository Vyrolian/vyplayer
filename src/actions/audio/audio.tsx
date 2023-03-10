import {
  PlayAction,
  PauseAction,
  ShuffleAction,
  NextAction,
} from "../../../types/audio/audio";
const audioElement = document.getElementById(
  "audio-element"
) as HTMLAudioElement;
export function play(): PlayAction {
  console.log("play action called");
  return {
    type: "PLAY",
  };
}

export function pause(): PauseAction {
  console.log("pause action called");
  return {
    type: "PAUSE",
  };
}
export function next(): NextAction {
  return {
    type: "NEXT",
  };
}
export function shuffle(): ShuffleAction {
  return {
    type: "SHUFFLE",
  };
}
