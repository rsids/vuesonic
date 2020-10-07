import { Module } from "vuex";
import { RootState } from "@/store/RootState";
import Vue from "vue";
import { SearchResponse } from "@/store/interfaces/subsonicResponse";
import { Artist } from "@/store/interfaces/artist";
import { Album } from "@/store/interfaces/album";
import { Song } from "@/store/interfaces/song";

interface SearchState {
  query: string;
  artists?: Artist[];
  albums?: Album[];
  songs?: Song[];
  hasMoreAlbums: boolean;
  hasMoreArtists: boolean;
  hasMoreSongs: boolean;
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

const SEARCH_DEFAULTS = {
  ALBUM_COUNT: 4,
  ARTIST_COUNT: 4,
  SONG_COUNT: 10
};

const state: SearchState = {
  hasMoreAlbums: false,
  hasMoreArtists: false,
  hasMoreSongs: false,
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
        artistCount: SEARCH_DEFAULTS.ARTIST_COUNT + 1,
        albumCount: SEARCH_DEFAULTS.ALBUM_COUNT + 1,
        songCount: SEARCH_DEFAULTS.SONG_COUNT + 1
      } as SearchParams;
      state.albums = [];
      state.artists = [];
      state.songs = [];
      state.query = query;
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SearchResponse) => {
          commit(MUTATE_ARTISTS, {
            artists: response.searchResult3.artist || []
          });
          commit(MUTATE_ALBUMS, { albums: response.searchResult3.album || [] });
          commit(MUTATE_SONGS, { songs: response.searchResult3.song || [] });
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
          params.albumOffset = SEARCH_DEFAULTS.ALBUM_COUNT;
          break;
        case "artists":
          params.artistCount = 9999;
          params.artistOffset = SEARCH_DEFAULTS.ARTIST_COUNT;
          break;
        case "songs":
          params.songCount = 9999;
          params.songOffset = SEARCH_DEFAULTS.SONG_COUNT;
          break;
      }
      return Vue.prototype.axios
        .get(`search3`, { params: params })
        .then((response: SearchResponse) => {
          switch (type) {
            case "artists":
              commit(MUTATE_ARTISTS, {
                artists: response.searchResult3.artist,
                append: true
              });
              break;
            case "albums":
              commit(MUTATE_ALBUMS, {
                albums: response.searchResult3.album,
                append: true
              });
              break;
            case "songs":
              commit(MUTATE_SONGS, {
                songs: response.searchResult3.song,
                append: true
              });
              break;
          }
        });
    }
  },
  mutations: {
    [MUTATE_ALBUMS](state: SearchState, { albums, append = false }) {
      if (append && state.albums) {
        state.albums = ([] as Album[]).concat(state.albums, albums);
        state.hasMoreAlbums = false;
      } else {
        state.hasMoreAlbums = albums.length > SEARCH_DEFAULTS.ALBUM_COUNT;
        state.albums = albums.splice(0, SEARCH_DEFAULTS.ALBUM_COUNT);
      }
    },
    [MUTATE_ARTISTS](state: SearchState, { artists, append = false }) {
      if (append && state.artists) {
        state.artists = ([] as Artist[]).concat(state.artists, artists);
        state.hasMoreArtists = false;
      } else {
        state.hasMoreArtists = artists.length > SEARCH_DEFAULTS.ARTIST_COUNT;
        state.artists = artists.splice(0, SEARCH_DEFAULTS.ARTIST_COUNT);
      }
    },
    [MUTATE_SONGS](state: SearchState, { songs, append = false }) {
      if (append && state.songs) {
        state.songs = ([] as Song[]).concat(state.songs, songs);
        state.hasMoreSongs = false;
      } else {
        state.hasMoreSongs = songs.length > SEARCH_DEFAULTS.SONG_COUNT;
        state.songs = songs.splice(0, SEARCH_DEFAULTS.SONG_COUNT);
      }
    }
  }
};
