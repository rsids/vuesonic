import { album } from "@/store/albumStore";
import { connection } from "@/store/connectionStore";
import { user } from "@/store/userStore";
import Vue from "vue";
import Vuex from "vuex";
import { stream } from "@/store/streamStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connection,
    user,
    album,
    stream
  }
});
