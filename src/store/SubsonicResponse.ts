import { Album } from "@/store/interfaces/album";
import { AlbumList } from "@/store/interfaces/albumList";
import { User } from "@/store/interfaces/user";
import { Directory } from "@/store/interfaces/directory";

export interface SubsonicResponse {
  status: string;
  version: string;
  user?: User;
  albumList?: AlbumList;
  album?: Album;
  directory?: Directory;
}

export interface SubsonicError {
  status: string;
  version: string;
  error: {
    code: number;
    message: string;
  };
}
