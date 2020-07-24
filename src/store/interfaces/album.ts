import { Song } from "@/store/interfaces/song";

export interface Album {
  album?: string;
  artist: string;
  artistId: number;
  coverArt: string;
  created: string;
  duration: number;
  genre?: string;
  id: number;
  name: string;
  song?: Song[];
  songCount: number;
  year: number;
  starred?: boolean;
  coverSmall?: string;
}
