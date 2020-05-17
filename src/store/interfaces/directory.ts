import { Song } from "@/store/interfaces/song";

export interface Directory {
  id: number;
  name: string;
  parent: number;
  playCount: number;
  child: Song[];
}
