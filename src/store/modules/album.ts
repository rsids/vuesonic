import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import axios, { CancelTokenSource } from "axios";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import {
  AlbumListResponse,
  AlbumResponse,
  DirectoryResponse,
  StarredResponse
} from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import { HttpResponse } from "jest-mock-axios/dist/lib/mock-axios-types";
import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from "vuex-module-decorators";

interface UpdateStar {
  id: number;
  albumId: number;
  toggle: boolean;
}

interface SetAlbums {
  albums: Album[];
  hasMoreAlbums: boolean;
}

interface Cancelable {
  cancel: Function;
}

const ALBUMSET_SIZE = 30;
const requests: CancelTokenSource[] = [];

@Module({ namespaced: true })
export default class AlbumStore extends VuexModule {
  albums: Album[] = [];
  albumsDetailed = new Map<number, Album>();
  covers = new Map<string, string>();
  currentAlbum!: Album | undefined;
  hasMoreAlbums = true;
  musicDirectoryAlbumAdapter = new Map<number, number>();
  recents: Album[] = [];
  starred!: Song[];

  @Mutation
  setAlbum(value?: Album) {
    this.currentAlbum = value;
  }

  @Mutation
  setCover(value: Cover) {
    this.covers.set(value.id, value.cover);
  }

  @Mutation
  setAlbums({ albums, hasMoreAlbums }: SetAlbums) {
    this.albums = ([] as Album[]).concat(this.albums, albums);
    this.hasMoreAlbums = hasMoreAlbums;
  }

  @Mutation
  setRecents(recents: Album[]) {
    this.recents = recents;
  }

  @Mutation
  setStarred(value: Song[]) {
    this.starred = ([] as Song[]).concat(value);
  }

  @Mutation
  updateStar({ id, albumId, toggle }: UpdateStar) {
    if (this.currentAlbum) {
      if (id) {
        this.currentAlbum.song = this.currentAlbum.song.map((song: Song) => {
          if (song.id === id) {
            song.starred = toggle;
          }
          return song;
        });
        if (this.starred) {
          if (toggle) {
            this.starred = this.starred.concat(this.currentAlbum.song);
          } else {
            this.starred = this.starred.filter(
              song =>
                this.currentAlbum?.song.find(s => s.id === song.id) ===
                undefined
            );
          }
        }
      }
      if (albumId) {
        if (this.currentAlbum.id === albumId) {
          this.currentAlbum.starred = toggle;
        }
      }
    }
  }

  @Action
  cancelAllRequests() {
    while (requests.length > 0) {
      (requests.pop() as Cancelable).cancel();
    }
  }

  @Action
  async getAlbum({ id }: { id: number }) {
    if (!this.albumsDetailed.has(id)) {
      const response: AlbumResponse = await Vue.prototype.axios.get(
        `getAlbum?id=${id}`
      );
      if (response.album) {
        response.album.song = response.album.song.map(song => {
          song.durationFormatted = duration(song.duration);
          song.starred = !!song.starred;
          return song;
        });
        this.albumsDetailed.set(id, response.album);
      }
    }

    this.context.commit("setAlbum", this.albumsDetailed.get(id));
    return this.albumsDetailed.get(id);
  }

  @Action
  async getAlbumFromMusicDirectory({ musicDirectory }) {
    if (!this.musicDirectoryAlbumAdapter.has(musicDirectory)) {
      const response: DirectoryResponse = await Vue.prototype.axios.get(
        `getMusicDirectory?id=${musicDirectory}`
      );

      this.musicDirectoryAlbumAdapter.set(
        musicDirectory,
        response.directory.child[0].albumId
      );
    }
    return this.context.dispatch("getAlbum", {
      id: this.musicDirectoryAlbumAdapter.get(musicDirectory) || 0
    });
  }

  @MutationAction
  async getRecents() {
    const response: AlbumListResponse = await Vue.prototype.axios.get(
      `getAlbumList?type=newest&size=20`
    );
    const albums =
      response.albumList.album?.map((album: Album) => {
        album.musicDirectory = album.id;
        album.id = undefined;
        return album;
      }) || [];

    return { recents: albums };
  }

  /**
   * Get a list of albums, by fetching ALBUMSET_SIZE + 1, we can determine
   * if there are more albums to fetch
   * @param start
   */
  @Action
  async getAlbums({ start }: { start: number }) {
    const response: AlbumListResponse = await Vue.prototype.axios.get(
      `getAlbumList?type=alphabeticalByName&size=${ALBUMSET_SIZE +
        1}&offset=${start}`
    );

    let albums = response.albumList.album || [];
    let hasMoreAlbums = true;
    if (albums && albums.length === ALBUMSET_SIZE + 1) {
      albums = albums.slice(0, ALBUMSET_SIZE);
    } else {
      hasMoreAlbums = false;
    }
    albums = albums.map(album => {
      album.musicDirectory = album.id;
      album.id = undefined;
      return album;
    });

    this.context.commit("setAlbums", { albums, hasMoreAlbums });
  }

  @Action({ rawError: true })
  async getCoverArt({ id, size }: { id: string; size?: string }) {
    const params = [`id=${encodeURIComponent(id)}`];
    let coverId = id;
    if (size) {
      const px = size === "small" ? 200 : 1000;
      params.push(`size=${px}`);
      coverId += `|${size}`;
    }
    if (this.covers.has(coverId)) {
      return this.covers.get(coverId);
    }

    const cover = await new Promise((resolve, reject) => {
      const request = axios.CancelToken.source();
      requests.push(request);
      Vue.prototype.axios
        .get(`getCoverArt?${params.join("&")}`, {
          responseType: "blob",
          cancelToken: request.token
        })
        .then((response: HttpResponse) => {
          if (response) {
            resolve(response.data);
          } else {
            reject();
          }
        })
        .catch(() => {
          // cancelled
          reject();
        });
    });

    this.covers.set(coverId, cover as string);

    return cover;
  }

  @MutationAction
  async getStarred() {
    const response: StarredResponse = await Vue.prototype.axios.get(
      `getStarred2`
    );
    const songs = ([] as Song[]).concat(response.starred2.song).map(song => {
      song.durationFormatted = duration(song.duration);
      return song;
    });
    return { starred: songs };
  }
}

// export interface AlbumState {
//   albums: Album[];
//   albumsDetailed: Map<number, Album>;
//   covers: Map<string, string>;
//   currentAlbum?: Album;
//   hasMoreAlbums: boolean;
//   musicDirectoryAlbumAdapter: Map<number, number>;
//   recents: Album[];
//   starred?: Song[];
// }
//
// interface Cancelable {
//   cancel: Function;
// }
//
// interface AlbumStore {
//   state: AlbumState;
//   commit: Commit;
//   dispatch: Dispatch;
// }
//
// const state: AlbumState = {
//   albums: [],
//   albumsDetailed: new Map<number, Album>(),
//   covers: new Map<string, string>(),
//   currentAlbum: undefined,
//   hasMoreAlbums: true,
//   musicDirectoryAlbumAdapter: new Map<number, number>(),
//   recents: [],
//   starred: undefined
// };
