export interface User {
  username: string;
  scrobblingEnabled: boolean;
  adminRole: boolean;
  settingsRole: boolean;
  downloadRole: boolean;
  uploadRole: boolean;
  playlistRole: boolean;
  coverArtRole: boolean;
  commentRole: boolean;
  podcastRole: boolean;
  streamRole: boolean;
  jukeboxRole: boolean;
  shareRole: boolean;
  videoConversionRole: boolean;
  // @todo Add correct type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  folder: Array<any>;
}
