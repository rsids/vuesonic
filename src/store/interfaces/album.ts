import { Song } from "@/store/interfaces/song";

export interface Album {
  artist: string;
  artistId: number;
  coverArt: string;
  created: string;
  duration: number;
  id: number;
  name: string;
  song: Song[];
  songCount: number;
  year: number;
  starred: boolean;
  coverSmall?: string;
}
