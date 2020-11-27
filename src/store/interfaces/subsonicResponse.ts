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
  albumList2?: AlbumList;
  artist?: Artist;
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

export interface AlbumResponse extends SubsonicResponse {
  album: Album;
}

export interface AlbumListResponse extends SubsonicResponse {
  albumList: AlbumList;
}

export interface DirectoryResponse extends SubsonicResponse {
  directory: Directory;
}

export interface PlaylistsResponse extends SubsonicResponse {
  playlists: PlaylistList;
}

export interface PlaylistResponse extends SubsonicResponse {
  playlist: Playlist;
}

export interface StarredResponse extends SubsonicResponse {
  starred2: {
    song: Song[];
  };
}

export interface UserResponse extends SubsonicResponse {
  user: User;
}

export interface SubsonicError {
  status: string;
  version: string;
  error: {
    code: number;
    message: string;
  };
}
