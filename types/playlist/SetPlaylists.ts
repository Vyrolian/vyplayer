export type Playlist = {
  id: string;
  name: string;
}[];
export type SetPlaylists = {
  type: "SET_PLAYLISTS";
  payload: {
    playlists: Playlist;
  };
};
