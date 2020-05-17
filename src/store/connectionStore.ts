import { RootState } from "@/store/RootState";
import { Module } from "vuex";
import { salt } from "@/utils/generic";
import { Md5 } from "ts-md5";

interface ConnectionState {
  username: string;
  password: string;
  server: string;
  hasCredentials: boolean;
}

export const state: ConnectionState = {
  password: sessionStorage.getItem("password") || "",
  server: sessionStorage.getItem("server") || "",
  username: sessionStorage.getItem("username") || "",
  hasCredentials: !!sessionStorage.getItem("server")
};

const actions = {
  clearCredentials() {
    sessionStorage.clear();
    state.hasCredentials = false;
  },

  storeCredentials({ state }, { user, password, server }) {
    if (server.endsWith("/")) {
      server = server.substr(0, server.length - 1);
    }
    state.username = user;
    state.password = password;
    state.server = server;
    state.hasCredentials = true;
    sessionStorage.setItem("username", user);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("server", server);
  },

  getUrl({ state, getters }, { url }) {
    const fullUrl = new URL(`${state.server}/rest/${url}`);
    for (const paramsKey in getters.params) {
      fullUrl.searchParams.append(paramsKey, getters.params[paramsKey]);
    }
    return fullUrl.toString();
  }
};

const getters = {
  server: (state: ConnectionState) => state.server,
  password: (state: ConnectionState) => state.password,
  username: (state: ConnectionState) => state.username,
  hasCredentials: (state: ConnectionState) => state.hasCredentials,
  params: (state: ConnectionState) => {
    const salted = salt();
    const token = new Md5()
      .appendStr(state.password)
      .appendStr(salted)
      .end()
      .toString();
    return {
      u: state.username,
      t: token,
      s: salted,
      c: "vuesonic",
      f: "json",
      v: "1.15.0"
    };
  }
};

export const connection: Module<ConnectionState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations: {}
};
