import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import axios, { AxiosResponse, CancelTokenSource } from "axios";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import {
  AlbumListResponse,
  AlbumResponse,
  DirectoryResponse,
  StarredResponse,
} from "@/store/interfaces/subsonicResponse";
import Vue from "vue";
import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule,
} from "vuex-module-decorators";
import { namespace } from "vuex-class";

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
  cancel: () => void;
}

const ALBUMSET_SIZE = 30;
const requests: CancelTokenSource[] = [];

export const album = namespace("album");

@Module({ namespaced: true })
export default class AlbumStore extends VuexModule {
  albums: Album[] = [];
  albumsDetailed = new Map<number, Album>();
  covers = new Map<string, string>();
  currentAlbum: Album | null = null;
  hasMoreAlbums = true;
  musicDirectoryAlbumAdapter = new Map<number, number>();
  recents: Album[] = [];
  starred: Song[] = [];

  @Mutation
  setAlbum(value: Album): void {
    this.currentAlbum = value || null;
  }

  @Mutation
  setCover(value: Cover): void {
    this.covers.set(value.id, value.cover);
  }

  @Mutation
  setAlbums({ albums, hasMoreAlbums }: SetAlbums): void {
    this.albums = ([] as Album[]).concat(this.albums, albums);
    this.hasMoreAlbums = hasMoreAlbums;
  }

  @Mutation
  setRecents(recents: Album[]): void {
    this.recents = recents;
  }

  @Mutation
  setStarred(value: Song[]): void {
    this.starred = ([] as Song[]).concat(value);
  }

  @Mutation
  updateStar({ id, albumId, toggle }: UpdateStar): void {
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
              (song) =>
                this.currentAlbum?.song.find((s) => s.id === song.id) ===
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
  cancelAllRequests(): void {
    while (requests.length > 0) {
      ((requests.pop() as unknown) as Cancelable).cancel();
    }
  }

  @Action
  async getAlbum({ id }: { id: number }): Promise<unknown> {
    if (!this.albumsDetailed.has(id)) {
      const response: AlbumResponse = await Vue.prototype.axios.get(
        `getAlbum?id=${id}`
      );
      if (response.album) {
        response.album.song = response.album.song.map((song) => {
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
  async getAlbumFromMusicDirectory({
    musicDirectory,
  }: {
    musicDirectory: number;
  }): Promise<unknown> {
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
      id: this.musicDirectoryAlbumAdapter.get(musicDirectory) || 0,
    });
  }

  @MutationAction
  async getRecents(): Promise<unknown> {
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
  async getAlbums({ start }: { start: number }): Promise<AlbumListResponse> {
    const response: AlbumListResponse = await Vue.prototype.axios.get(
      `getAlbumList?type=alphabeticalByName&size=${
        ALBUMSET_SIZE + 1
      }&offset=${start}`
    );

    let albums = response.albumList.album || [];
    let hasMoreAlbums = true;
    if (albums && albums.length === ALBUMSET_SIZE + 1) {
      albums = albums.slice(0, ALBUMSET_SIZE);
    } else {
      hasMoreAlbums = false;
    }
    albums = albums.map((album) => {
      album.musicDirectory = album.id;
      album.id = undefined;
      return album;
    });

    this.context.commit("setAlbums", { albums, hasMoreAlbums });
    return response;
  }

  @Action({ rawError: true })
  async getCoverArt({
    id,
    size,
  }: {
    id: string;
    size?: string;
  }): Promise<unknown> {
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
          cancelToken: request.token,
        })
        .then((response: AxiosResponse) => {
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
  async getStarred(): Promise<unknown> {
    const response: StarredResponse = await Vue.prototype.axios.get(
      `getStarred2`
    );
    const songs = ([] as Song[]).concat(response.starred2.song).map((song) => {
      song.durationFormatted = duration(song.duration);
      return song;
    });
    return { starred: songs };
  }
}
