import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import {
  SearchResponse,
  SubsonicResponse
} from "@/store/interfaces/subsonicResponse";
import { Artist } from "@/store/interfaces/artist";
import { Album } from "@/store/interfaces/album";
import { Song } from "@/store/interfaces/song";

interface SearchState {
  query: string;
  artists?: Artist[];
  albums?: Album[];
  songs?: Song[];
}

interface SearchParams {
  query: string;
  albumCount?: number;
  albumOffset?: number;
  artistCount?: number;
  artistOffset?: number;
  songCount?: number;
  songOffset?: number;
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
        query: query,
        artistCount: 4,
        albumCount: 4,
        songCount: 10
      } as SearchParams;
      state.albums = [];
      state.artists = [];
      state.songs = [];
      state.query = query;
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SearchResponse) => {
          commit(MUTATE_ARTISTS, response.searchResult3?.artist);
          commit(MUTATE_ALBUMS, response.searchResult3?.album);
          commit(MUTATE_SONGS, response.searchResult3?.song);
        });
    },

    searchMore({ commit, state }, { type }) {
      const params = {
        query: state.query,
        artistCount: 0,
        albumCount: 0,
        songCount: 0
      } as SearchParams;
      switch (type) {
        case "albums":
          params.albumCount = 9999;
          params.albumOffset = 4;
          break;
        case "artists":
          params.artistCount = 9999;
          params.artistOffset = 4;
          break;
        case "songs":
          params.songCount = 9999;
          params.songOffset = 4;
          break;
      }
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SearchResponse) => {
          switch (type) {
            case "artists":
              commit(MUTATE_ARTISTS, [
                ...(state.artists as Artist[]),
                ...response.searchResult3?.artist
              ]);
              break;
            case "albums":
              commit(MUTATE_ALBUMS, [
                ...(state.albums as Album[]),
                ...response.searchResult3?.album
              ]);
              break;
            case "songs":
              commit(MUTATE_SONGS, [
                ...(state.songs as Song[]),
                ...response.searchResult3?.song
              ]);
              break;
          }
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
