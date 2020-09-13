import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";

interface SearchState {
  query: string;
}

const state: SearchState = {
  query: ""
};
export const search: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions: {
    search({ state }, { query }) {
      const params = {
        query: query
      };
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SubsonicResponse) => {
          // eslint-disable-next-line no-console
          console.log(response);
        });
    }
  },
  mutations: {}
};
