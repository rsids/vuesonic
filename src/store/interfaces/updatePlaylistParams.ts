import { Song } from "@/store/interfaces/song";

export interface UpdatePlaylistParams {
  playlistId: number;
  name?: string;
  comment?: string;
  public?: boolean;
  songsToAdd?: Song[];
  songIndexToRemove?: number[];
  [x: string]: any;
}
