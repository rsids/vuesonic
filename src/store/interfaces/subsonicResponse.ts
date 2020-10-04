import { Album } from "@/store/interfaces/album";
import { AlbumList } from "@/store/interfaces/albumList";
import { User } from "@/store/interfaces/user";
import { Directory } from "@/store/interfaces/directory";
import { PlaylistList } from "@/store/interfaces/playlistList";
import { Playlist } from "@/store/interfaces/playlist";
import { Index } from "@/store/interfaces/index";
import { Artist } from "@/store/interfaces/artist";
import { Song } from "@/store/interfaces/song";

export interface SubsonicResponse {
  status: string;
  version?: string;
  user?: User;
  albumList?: AlbumList;
  albumList2?: AlbumList;
  artist?: Artist;
  album?: Album;
  directory?: Directory;
  playlists?: PlaylistList;
  playlist?: Playlist;
  starred2: {
    song: Song[];
  };
  artists?: {
    index: Index[];
  };
}

export interface SearchResponse extends SubsonicResponse {
  searchResult3: {
    artist?: Artist;
    album?: Album;
    song?: Song;
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
