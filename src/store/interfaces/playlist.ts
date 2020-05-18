import { Song } from "@/store/interfaces/song";

export interface Playlist {
  changed: string;
  coverArt: string;
  created: string;
  duration: number;
  id: number;
  name: string;
  owner: string;
  public: false;
  songCount: number;
  entry: Song[];
}
