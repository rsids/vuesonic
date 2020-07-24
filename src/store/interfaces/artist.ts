import { Album } from "@/store/interfaces/album";

export interface Artist {
  albumCount: number;
  album?: Album[];
  cover?: string;
  coverArt?: string;
  id: number;
  name: string;
  starred?: boolean;
}
