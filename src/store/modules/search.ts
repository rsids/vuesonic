import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";
import { Artist } from "@/store/interfaces/artist";
import { Album } from "@/store/interfaces/album";
import { Song } from "@/store/interfaces/song";

interface SearchState {
  query: string;
  artists?: Artist[];
  albums?: Album[];
  songs?: Song[];
}

const MUTATE_ALBUMS = "mutateAlbums";
const MUTATE_ARTISTS = "mutateArtists";
const MUTATE_SONGS = "mutateSongs";

const state: SearchState = {
  query: "",
  albums: [],
  artists: [],
  songs: []
};
export const search: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions: {
    search({ commit, state }, { query }) {
      const params = {
        query: query
      };
      state.albums = [];
      state.artists = [];
      state.songs = [];
      state.query = query;
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SubsonicResponse) => {
          commit(MUTATE_ARTISTS, response?.searchResult3?.artist);
          commit(MUTATE_ALBUMS, response?.searchResult3?.album);
          commit(MUTATE_SONGS, response?.searchResult3?.song);
          // state.artists = response?.searchResult3?.artist ?? null;
        });
    }
  },
  mutations: {
    [MUTATE_ALBUMS](state: SearchState, albums: Album[]) {
      state.albums = albums;
    },
    [MUTATE_ARTISTS](state: SearchState, artists: Artist[]) {
      state.artists = artists;
    },
    [MUTATE_SONGS](state: SearchState, songs: Song[]) {
      state.songs = songs;
    }
  }
};
