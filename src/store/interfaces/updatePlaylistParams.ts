import { Song } from "@/store/interfaces/song";

export interface UpdatePlaylistParams {
  playlistId: number;
  name?: string;
  comment?: string;
  public?: boolean;
  songsToAdd?: Song[];
  songIndexToRemove?: number[];
  // @todo Add correct type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}
