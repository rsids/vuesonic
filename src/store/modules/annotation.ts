import { RootState } from "@/store/RootState";
import { Module } from "vuex";
import Vue from "vue";

interface AnnotationState {
  stars: number;
}

const state: AnnotationState = {
  stars: 0
};

const mutations = {};

const actions = {
  star({ commit }, { id, albumId, artistId, toggle }) {
    const params: string[] = [];
    const action = toggle ? "star" : "unstar";
    if (id) {
      params.push(`id=${id}`);
    }
    if (albumId) {
      params.push(`albumId=${albumId}`);
    }
    if (artistId) {
      params.push(`artistId=${artistId}`);
    }
    return Vue.prototype.axios.get(`${action}?${params.join("&")}`).then(() => {
      commit(
        "album/updateStar",
        { id, albumId, artistId, toggle },
        { root: true }
      );
      commit(
        "playlist/updateStar",
        { id, albumId, artistId, toggle },
        { root: true }
      );
    });
  }
};

export const annotation: Module<AnnotationState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
