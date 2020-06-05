import { album } from "@/store/albumStore";
import { connection } from "@/store/connectionStore";
import { user } from "@/store/userStore";
import Vue from "vue";
import Vuex from "vuex";
import { stream } from "@/store/streamStore";
import { annotation } from "@/store/annotationStore";
import { playlist } from "@/store/playlistStore";
import { artist } from "@/store/artistStore";
import { search } from "@/store/searchStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connection,
    user,
    album,
    stream,
    annotation,
    playlist,
    artist,
    search
  }
});
