import { Album } from "@/store/interfaces/album";
import { Cover } from "@/store/interfaces/cover";
import { RootState } from "@/store/RootState";
import { SubsonicResponse } from "@/store/SubsonicResponse";
import Vue from "vue";
import { Module } from "vuex";

interface AlbumState {
  recents: Album[];
  covers: Map<string, string>;
}

const state: AlbumState = {
  recents: [],
  covers: new Map<string, string>()
};

const SET_RECENTS = "setRecentsMutation";
const SET_COVER = "setCover";

const mutations = {
  [SET_RECENTS](state: AlbumState, value: Album[]) {
    state.recents = Array.from(value);
  },
  [SET_COVER](state: AlbumState, value: Cover) {
    state.covers.set(value.id, value.cover);
  }
};

const actions = {
  getAlbum(ctx, { id }) {
    return Vue.prototype.axios
      .get(`getAlbum?id=${id}`)
      .then((response: SubsonicResponse) => {
        return response.album;
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
