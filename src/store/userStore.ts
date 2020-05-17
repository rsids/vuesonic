import { User } from "@/store/interfaces/user";
import { RootState } from "@/store/RootState";
import { SubsonicResponse } from "@/store/SubsonicResponse";
import Vue from "vue";
import { Module } from "vuex";

interface UserState {
  user?: User;
}

const state: UserState = {
  user: undefined
};

const SET_USER = "setUserMutation";

const mutations = {
  [SET_USER](state: UserState, value: User) {
    state.user = value;
  }
};

const actions = {
  getUser({ commit, state }, { user }) {
    return new Promise((resolve, reject) => {
      Vue.prototype.axios
        .get(`getUser?username=${user}`)
        .then((response: SubsonicResponse) => {
          commit(SET_USER, response.user);
          resolve(state.user);
        })
        .catch(() => {
          reject({
            code: 70
          });
        });
    });
  },
  getUsers() {
    throw new Error("Not implemented");
  },
  createUser() {
    throw new Error("Not implemented");
  },
  updateUser() {
    throw new Error("Not implemented");
  },
  deleteUser() {
    throw new Error("Not implemented");
  },
  changePassword() {
    throw new Error("Not implemented");
  }
};

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
