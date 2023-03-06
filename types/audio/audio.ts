export type PlayAction = {
  type: "PLAY";
};

export type PauseAction = {
  type: "PAUSE";
};

export type NextAction = {
  type: "NEXT";
};
export type ShuffleAction = {
  type: "SHUFFLE";
};

export type AudioAction = PlayAction | PauseAction | NextAction | ShuffleAction;
