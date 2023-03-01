export type SetDeletedPlaylist = {
  type: "SET_DELETED_PLAYLIST";
  payload: {
    deletedPlaylist: string;
  };
};
