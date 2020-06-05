import { Album } from "@/store/interfaces/album";
import { AlbumList } from "@/store/interfaces/albumList";
import { User } from "@/store/interfaces/user";
import { Directory } from "@/store/interfaces/directory";
import { PlaylistList } from "@/store/interfaces/playlistList";
import { Playlist } from "@/store/interfaces/playlist";
import { Index } from "@/store/interfaces/Index";
import { Artist } from "@/store/interfaces/artist";

export interface SubsonicResponse {
  status: string;
  version: string;
  user?: User;
  albumList?: AlbumList;
  albumList2?: AlbumList;
  artist?: Artist;
  album?: Album;
  directory?: Directory;
  playlists?: PlaylistList;
  playlist?: Playlist;
  artists?: {
    index: Index[];
  };
}

export interface SubsonicError {
  status: string;
  version: string;
  error: {
    code: number;
    message: string;
  };
}
