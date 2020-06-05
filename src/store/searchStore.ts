import { Module } from "vuex";
import { RootState } from "@/store/RootState";

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
  actions: {},
  mutations: {}
};
