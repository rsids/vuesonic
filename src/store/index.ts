import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import AnnotationStore from "@/store/modules/annotation";
import ArtistStore from "@/store/modules/artist";
import SearchStore from "@/store/modules/search";
import PlaylistStore from "@/store/modules/playlist";
import { connection } from "@/store/modules/connection";
import { user } from "@/store/modules/user";
import StreamStore from "@/store/modules/stream";
import { ui } from "@/store/modules/ui";
import { RootState } from "@/store/RootState";
import AlbumStore from "@/store/modules/album";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    album: AlbumStore,
    annotation: AnnotationStore,
    artist: ArtistStore,
    connection,
    playlist: PlaylistStore,
    search: SearchStore,
    stream: StreamStore,
    ui,
    user
  }
};

export default new Vuex.Store(store);
