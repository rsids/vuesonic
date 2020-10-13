import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import { RootState } from "@/store/RootState";
import axios, { CancelTokenSource } from "axios";
import { Module } from "vuex";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import {
  AlbumListResponse,
  SubsonicError,
  SubsonicResponse
} from "@/store/interfaces/subsonicResponse";
import Vue from "vue";

interface AlbumState {
  albums: Album[];
  albumsDetailed: Map<string, Album>;
  covers: Map<string, string>;
  currentAlbum?: Album;
  hasMoreAlbums: boolean;
  musicDirectoryAlbumAdapter: Map<string, string>;
  recents: Album[];
  starred?: Song[];
}

interface Cancelable {
  cancel: Function;
}

const state: AlbumState = {
  albums: [],
  albumsDetailed: new Map<string, Album>(),
  covers: new Map<string, string>(),
  currentAlbum: undefined,
  hasMoreAlbums: true,
  musicDirectoryAlbumAdapter: new Map<string, string>(),
  recents: [],
  starred: undefined
};

const ALBUMSET_SIZE = 30;
const requests: CancelTokenSource[] = [];
export const SET_ALBUM = "setAlbum";
export const SET_ALBUMS = "setAlbums";
export const SET_COVER = "setCover";
export const SET_RECENTS = "setRecentsMutation";
export const SET_STARRED = "setStarred";
export const UPDATE_STAR = "updateStar";

const mutations = {
  [SET_ALBUM](state: AlbumState, value: Album) {
    state.currentAlbum = value;
  },
  [SET_COVER](state: AlbumState, value: Cover) {
    state.covers.set(value.id, value.cover);
  },
  [SET_ALBUMS](state: AlbumState, { albums, hasMoreAlbums }) {
    state.albums = ([] as Album[]).concat(state.albums, albums);
    state.hasMoreAlbums = hasMoreAlbums;
  },
  [SET_RECENTS](state: AlbumState, recents) {
    state.recents = recents;
  },
  [SET_STARRED](state: AlbumState, value: Song[]) {
    state.starred = ([] as Song[]).concat(value);
  },
  [UPDATE_STAR](state: AlbumState, { id, albumId, toggle }) {
    if (state.currentAlbum) {
      if (id) {
        state.currentAlbum.song = state.currentAlbum.song.map((song: Song) => {
          if (song.id === id) {
            song.starred = toggle;
          }
          return song;
        });
        if (state.starred) {
          if (toggle) {
            state.starred = state.starred.concat(state.currentAlbum.song);
          } else {
            state.starred = state.starred.filter(
              song =>
                state.currentAlbum?.song.find(s => s.id === song.id) ===
                undefined
            );
          }
        }
      }
      if (albumId) {
        if (state.currentAlbum.id === albumId) {
          state.currentAlbum.starred = toggle;
        }
      }
    }
  }
};

const actions = {
  cancelAllRequests() {
    while (requests.length > 0) {
      (requests.pop() as Cancelable).cancel();
    }
  },

  getAlbum({ commit, state }, { id }) {
    return new Promise((resolve, reject) => {
      if (state.albumsDetailed.has(id)) {
        commit(SET_ALBUM, state.albumsDetailed.get(id));
        resolve(state.currentAlbum);
      } else {
        Vue.prototype.axios.get(`getAlbum?id=${id}`).then(
          (response: SubsonicResponse) => {
            if (response.album) {
              response.album.song = response.album.song.map(song => {
                song.durationFormatted = duration(song.duration);
                song.starred = !!song.starred;
                return song;
              });
              state.albumsDetailed.set(id, response.album);
            }
            commit(SET_ALBUM, response.album);
            resolve(state.currentAlbum);
          },
          (err: SubsonicError) => reject(err)
        );
      }
    });
  },

  getAlbumFromMusicDirectory({ commit, state }, { musicDirectory }) {
    return new Promise(resolve => {
      const getAlbum = function(albumId) {
        return actions
          .getAlbum({ commit, state }, { id: albumId })
          .then(resolve);
      };
      if (state.musicDirectoryAlbumAdapter.has(musicDirectory)) {
        return getAlbum(state.musicDirectoryAlbumAdapter.get(musicDirectory));
      }
      Vue.prototype.axios
        .get(`getMusicDirectory?id=${musicDirectory}`)
        .then((response: SubsonicResponse) => {
          state.musicDirectoryAlbumAdapter.set(
            musicDirectory,
            response?.directory?.child[0].albumId
          );
          return getAlbum(response?.directory?.child[0].albumId);
        });
    });
  },
  getRecents({ commit, state }) {
    return Vue.prototype.axios
      .get(`getAlbumList?type=newest&size=20`)
      .then((response: AlbumListResponse) => {
        const albums =
          response.albumList.album?.map(album => {
            album.musicDirectory = album.id;
            album.id = undefined;
            return album;
          }) || [];
        commit(SET_RECENTS, albums);
        return state.recents;
      });
  },

  getAlbums({ commit, state }, { start }) {
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
        commit(SET_ALBUMS, { albums: albums, hasMoreAlbums: hasMoreAlbums });
        return state.albums;
      });
  },

  getCoverArt({ commit, state }, { id, size }) {
    const params = [`id=${encodeURIComponent(id)}`];
    let coverId = id;
    if (size) {
      const px = size === "small" ? 200 : 1000;
      params.push(`size=${px}`);
      coverId += `|${size}`;
    }
    return new Promise((resolve, reject) => {
      if (state.covers.has(coverId)) {
        resolve(state.covers.get(coverId));
      } else {
        const request = axios.CancelToken.source();
        requests.push(request);
        return Vue.prototype.axios
          .get(`getCoverArt?${params.join("&")}`, {
            responseType: "blob",
            cancelToken: request.token
          })
          .then(response => {
            if (response) {
              commit(SET_COVER, {
                id: coverId,
                cover: response.data
              });
              resolve(state.covers.get(coverId));
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
  },

  getStarred({ commit, state }) {
    return Vue.prototype.axios
      .get(`getStarred2`)
      .then((response: SubsonicResponse) => {
        const songs = ([] as Song[])
          .concat(response.starred2?.song)
          .map(song => {
            song.durationFormatted = duration(song.duration);
            return song;
          });
        commit(SET_STARRED, songs);
        return state.starred;
      });
  }
};

export const album: Module<AlbumState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
