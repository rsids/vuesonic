import { Artist } from "@/store/interfaces/artist";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import { Module } from "vuex";
import { Index } from "@/store/interfaces";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";

interface ArtistState {
  artists: Artist[];
  covers: Map<string, string>;
  currentArtist?: Artist;
}
const state: ArtistState = {
  artists: [],
  covers: new Map<string, string>(),
  currentArtist: undefined
};

const SET_ARTISTS = "setArtists";
export const SET_ARTIST = "setArtist";

const mutations = {
  [SET_ARTISTS](state: ArtistState, value: Artist[]) {
    state.artists = Array.from(value);
  },
  [SET_ARTIST](state: ArtistState, value: Artist) {
    state.currentArtist = value;
  }
};

const actions = {
  getArtists({ commit, state }) {
    return Vue.prototype.axios
      .get(`getArtists`)
      .then((response: SubsonicResponse) => {
        const artists: Artist[] = [];
        if (response.artists) {
          response.artists.index.forEach((idx: Index) => {
            artists.push(...idx.artist);
          });
          commit(SET_ARTISTS, artists);
        }
        return state.artists;
      });
  },

  getArtist({ commit, state }, { id }) {
    return Vue.prototype.axios
      .get(`getArtist?id=${id}`)
      .then((response: SubsonicResponse) => {
        if (response?.artist) {
          commit(SET_ARTIST, response.artist);
        }
        return state.currentArtist;
      });
  }
};

export const artist: Module<ArtistState, RootState> = {
  namespaced: true,
  state,
  getters: {},
  actions,
  mutations
};
