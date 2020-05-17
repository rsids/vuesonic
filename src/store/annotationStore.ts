import { RootState } from "@/store/RootState";
import Vue from "vue";
import { Module } from "vuex";

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
      params.push(`id=${albumId}`);
    }
    if (artistId) {
      params.push(`id=${artistId}`);
    }
    return Vue.prototype.axios.get(`${action}?${params.join("&")}`).then(() => {
      commit(
        "album/updateStar",
        { id, albumId, artistId, toggle },
        { root: true }
      );
    });
  }

  // unstar(ctx, { id }) {
  //   return Vue.prototype.axios
  //     .get(`getMusicDirectory?id=${id}`)
  //     .then((response: SubsonicResponse) => {
  //       // eslint-disable-next-line no-console
  //       return actions.getAnnotation(ctx, {
  //         id: response?.directory?.child[0].annotationId
  //       });
  //     });
  // }
};

export const annotation: Module<AnnotationState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
