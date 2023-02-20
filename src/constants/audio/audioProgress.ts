import { audioElement } from "./audioElement";

const progress = (audioElement?.currentTime / audioElement?.duration) * 100;

export { progress };
