export type PlayAction = {
  type: "PLAY";
};

export type PauseAction = {
  type: "PAUSE";
};

export type SkipAction = {
  type: "SKIP";
};

export type AudioAction = PlayAction | PauseAction | SkipAction;
