import { RootState } from "@/store/RootState";
import { Module } from "vuex";

interface UiState {
  tabs?: string[];
  tab: string | undefined;
}

const state: UiState = {
  tabs: [],
  tab: undefined
};

export const SET_TAB = "setTabMutation";
export const SET_TABS = "setTabsMutation";

const mutations = {
  [SET_TAB](state: UiState, value: string) {
    state.tab = value;
  },
  [SET_TABS](state: UiState, value: string[]) {
    state.tabs = ([] as string[]).concat(value);
  }
};

const actions = {};

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
