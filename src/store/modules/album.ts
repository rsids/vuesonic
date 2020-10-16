import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import axios, { CancelTokenSource } from "axios";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import {
  AlbumListResponse,
  DirectoryResponse,
  StarredResponse,
  SubsonicError,
  SubsonicResponse
} from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import { HttpResponse } from "jest-mock-axios/dist/lib/mock-axios-types";
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";

interface IUpdateStar {
  id: number;
  albumId: number;
  toggle: boolean;
}
interface ISetAlbums {
  albums: Album[];
  hasMoreAlbums: boolean;
}

interface Cancelable {
  cancel: Function;
}

const ALBUMSET_SIZE = 30;
const requests: CancelTokenSource[] = [];

@Module
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
  setAlbums({ albums, hasMoreAlbums }: ISetAlbums) {
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
  updateStar({ id, albumId, toggle }: IUpdateStar) {
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
  getAlbum({ id }: { id: number }) {
    return new Promise((resolve, reject) => {
      if (this.albumsDetailed.has(id)) {
        this.setAlbum(this.albumsDetailed.get(id) as Album);
        resolve(this.currentAlbum);
      } else {
        Vue.prototype.axios.get(`getAlbum?id=${id}`).then(
          (response: SubsonicResponse) => {
            if (response.album) {
              response.album.song = response.album.song.map(song => {
                song.durationFormatted = duration(song.duration);
                song.starred = !!song.starred;
                return song;
              });
              this.albumsDetailed.set(id, response.album);
            }
            this.setAlbum(response.album);
            resolve(this.currentAlbum);
          },
          (err: SubsonicError) => reject(err)
        );
      }
    });
  }

  @Action
  getAlbumFromMusicDirectory({ musicDirectory }: { musicDirectory: number }) {
    return new Promise(resolve => {
      const getAlbum = (albumId: number) => {
        return this.getAlbum({ id: albumId }).then(resolve);
      };
      if (this.musicDirectoryAlbumAdapter.has(musicDirectory)) {
        return getAlbum(
          this.musicDirectoryAlbumAdapter.get(musicDirectory) || 0
        );
      }
      Vue.prototype.axios
        .get(`getMusicDirectory?id=${musicDirectory}`)
        .then((response: DirectoryResponse) => {
          this.musicDirectoryAlbumAdapter.set(
            musicDirectory,
            response.directory.child[0].albumId
          );
          return getAlbum(response.directory.child[0].albumId);
        });
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

  @Action
  getAlbums({ start }: { start: number }) {
    return Vue.prototype.axios
      .get(
        `getAlbumList?type=alphabeticalByName&size=${ALBUMSET_SIZE +
          1}&offset=${start}`
      )
      .then((response: AlbumListResponse) => {
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
        this.setAlbums({ albums: albums, hasMoreAlbums: hasMoreAlbums });
      });
  }

  @Action
  getCoverArt({ id, size }: { id: string; size?: string }) {
    const params = [`id=${encodeURIComponent(id)}`];
    let coverId = id;
    if (size) {
      const px = size === "small" ? 200 : 1000;
      params.push(`size=${px}`);
      coverId += `|${size}`;
    }
    return new Promise((resolve, reject) => {
      if (this.covers.has(coverId)) {
        resolve(this.covers.get(coverId));
      } else {
        const request = axios.CancelToken.source();
        requests.push(request);
        return Vue.prototype.axios
          .get(`getCoverArt?${params.join("&")}`, {
            responseType: "blob",
            cancelToken: request.token
          })
          .then((response: HttpResponse) => {
            if (response) {
              this.setCover({
                id: coverId,
                cover: response.data
              });
              resolve(this.covers.get(coverId));
            } else {
              reject();
            }
          })
          .catch(() => {
            // cancelled
            reject();
          });
      }
    });
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
