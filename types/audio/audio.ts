export type PlayAction = {
  type: "PLAY";
};

export type PauseAction = {
  type: "PAUSE";
};

export type ShuffleAction = {
  type: "SHUFFLE";
};

export type AudioAction = PlayAction | PauseAction | ShuffleAction;
