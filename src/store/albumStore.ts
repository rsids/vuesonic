import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import { Module } from "vuex";
import { Song } from "@/store/interfaces/song";
import { duration } from "@/utils/generic";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";

interface AlbumState {
  albums: Album[];
  recents: Album[];
  covers: Map<string, string>;
  currentAlbum?: Album;
}

const state: AlbumState = {
  albums: [],
  recents: [],
  covers: new Map<string, string>(),
  currentAlbum: undefined
};

const SET_ALBUMS = "setAlbums";
const SET_RECENTS = "setRecentsMutation";
const SET_COVER = "setCover";
const SET_ALBUM = "setAlbum";
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
  [SET_ALBUMS](state: AlbumState, value: Album[]) {
    state.albums = value;
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
  getAlbum({ commit, state }, { id }) {
    return Vue.prototype.axios
      .get(`getAlbum?id=${id}`)
      .then((response: SubsonicResponse) => {
        if (response.album) {
          response.album.song = response.album.song.map(song => {
            song.durationFormatted = duration(song.duration);
            song.starred = !!song.starred;
            return song;
          });
        }
        commit(SET_ALBUM, response.album);
        return state.currentAlbum;
      });
  },

  getAlbumFromMusicDirectory(ctx, { id }) {
    return Vue.prototype.axios
      .get(`getMusicDirectory?id=${id}`)
      .then((response: SubsonicResponse) => {
        // eslint-disable-next-line no-console
        return actions.getAlbum(ctx, {
          id: response?.directory?.child[0].albumId
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
  getAlbums({ commit, state }) {
    return Vue.prototype.axios
      .get(`getAlbumList?type=alphabeticalByName&size=21`)
      .then((response: SubsonicResponse) => {
        commit(SET_ALBUMS, response.albumList?.album);
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
    return new Promise(resolve => {
      if (state.covers.has(coverId)) {
        resolve(state.covers.get(coverId));
      } else {
        return Vue.prototype.axios
          .get(`getCoverArt?${params.join("&")}`, {
            responseType: "blob"
          })
          .then(response => {
            commit(SET_COVER, {
              id: coverId,
              cover: response.data
            });
            resolve(state.covers.get(coverId));
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
