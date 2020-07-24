import Vue from "vue";
import Vuex from "vuex";
import { album } from "@/store/modules/album";
import { annotation } from "@/store/modules/annotation";
import { artist } from "@/store/modules/artist";
import { search } from "@/store/modules/search";
import { playlist } from "@/store/modules/playlist";
import { connection } from "@/store/modules/connection";
import { user } from "@/store/modules/user";
import { stream } from "@/store/modules/stream";
import { ui } from "@/store/modules/ui";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    album,
    annotation,
    artist,
    connection,
    playlist,
    search,
    stream,
    ui,
    user
  }
});
