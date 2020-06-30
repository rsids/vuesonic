import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import axios, { CancelTokenSource } from "axios";
import { Module } from "vuex";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";

interface AlbumState {
  albums: Album[];
  hasMoreAlbums: boolean;
  recents: Album[];
  covers: Map<string, string>;
  albumsDetailed: Map<string, Album>;
  musicDirectoryAlbumAdapter: Map<string, string>;
  currentAlbum?: Album;
}

interface Cancelable {
  cancel: Function;
}

const state: AlbumState = {
  albums: [],
  hasMoreAlbums: true,
  recents: [],
  covers: new Map<string, string>(),
  albumsDetailed: new Map<string, Album>(),
  musicDirectoryAlbumAdapter: new Map<string, string>(),
  currentAlbum: undefined
};
const requests: CancelTokenSource[] = [];
const SET_ALBUMS = "setAlbums";
const SET_RECENTS = "setRecentsMutation";
const SET_COVER = "setCover";
export const SET_ALBUM = "setAlbum";
export const UPDATE_STAR = "updateStar";

const mutations = {
  [SET_RECENTS](state: AlbumState, value: Album[]) {
    state.recents = Array.from(value);
  },
  [SET_COVER](state: AlbumState, value: Cover) {
    state.covers.set(value.id, value.cover);
  },
  [SET_ALBUM](state: AlbumState, value: Album) {
    state.currentAlbum = value;
  },
  [SET_ALBUMS](state: AlbumState, { albums, hasMoreAlbums }) {
    state.albums = ([] as Album[]).concat(state.albums, albums);
    state.hasMoreAlbums = hasMoreAlbums;
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
    return new Promise(resolve => {
      if (state.albumsDetailed.has(id)) {
        commit(SET_ALBUM, state.albumsDetailed.get(id));
        resolve(state.currentAlbum);
      } else {
        Vue.prototype.axios
          .get(`getAlbum?id=${id}`)
          .then((response: SubsonicResponse) => {
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
          });
      }
    });
  },

  getAlbumFromMusicDirectory({ commit, state }, { id }) {
    return new Promise(resolve => {
      const getAlbum = function(albumId) {
        return actions
          .getAlbum({ commit, state }, { id: albumId })
          .then(resolve);
      };
      if (state.musicDirectoryAlbumAdapter.has(id)) {
        return getAlbum(state.musicDirectoryAlbumAdapter.get(id));
      }
      Vue.prototype.axios
        .get(`getMusicDirectory?id=${id}`)
        .then((response: SubsonicResponse) => {
          state.musicDirectoryAlbumAdapter.set(
            id,
            response?.directory?.child[0].albumId
          );
          return getAlbum(response?.directory?.child[0].albumId);
        });
    });
  },
  getRecents({ commit, state }) {
    return Vue.prototype.axios
      .get(`getAlbumList?type=newest&size=20`)
      .then((response: SubsonicResponse) => {
        commit(SET_RECENTS, response.albumList?.album);
        return state.recents;
      });
  },
  getAlbums({ commit, state }, { start }) {
    return Vue.prototype.axios
      .get(`getAlbumList?type=alphabeticalByName&size=21&offset=${start}`)
      .then((response: SubsonicResponse) => {
        let albums = response.albumList?.album;
        let hasMoreAlbums = true;
        if (albums && albums.length === 21) {
          albums = albums.slice(0, 20);
        } else {
          hasMoreAlbums = false;
        }
        commit(SET_ALBUMS, { albums: albums, hasMore: hasMoreAlbums });
        return state.recents;
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
  }
};

export const album: Module<AlbumState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
