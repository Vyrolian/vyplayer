export interface SetVolumeAction {
    type: 'SET_VOLUME';
    payload: {
      volume: number;
    };
  }
  