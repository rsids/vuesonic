import Vue from "vue";
import { SearchResponse } from "@/store/interfaces/subsonicResponse";
import { Artist } from "@/store/interfaces/artist";
import { Album } from "@/store/interfaces/album";
import { Song } from "@/store/interfaces/song";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

interface SearchParams {
  query: string;
  albumCount?: number;
  albumOffset?: number;
  artistCount?: number;
  artistOffset?: number;
  songCount?: number;
  songOffset?: number;
}

const SEARCH_DEFAULTS = {
  ALBUM_COUNT: 4,
  ARTIST_COUNT: 4,
  SONG_COUNT: 10
};

@Module({ namespaced: true })
export default class SearchStore extends VuexModule {
  query = "";
  artists: Artist[] = [];
  albums: Album[] = [];
  songs: Song[] = [];
  hasMoreAlbums = false;
  hasMoreArtists = false;
  hasMoreSongs = false;

  @Mutation
  setAlbums({ albums, append = false }) {
    if (append && this.albums) {
      this.albums = ([] as Album[]).concat(this.albums, albums);
      this.hasMoreAlbums = false;
    } else {
      this.hasMoreAlbums = albums.length > SEARCH_DEFAULTS.ALBUM_COUNT;
      this.albums = albums.splice(0, SEARCH_DEFAULTS.ALBUM_COUNT);
    }
  }

  @Mutation
  setArtists({ artists, append = false }) {
    if (append && this.artists) {
      this.artists = ([] as Artist[]).concat(this.artists, artists);
      this.hasMoreArtists = false;
    } else {
      this.hasMoreArtists = artists.length > SEARCH_DEFAULTS.ARTIST_COUNT;
      this.artists = artists.splice(0, SEARCH_DEFAULTS.ARTIST_COUNT);
    }
  }

  @Mutation
  setSongs({ songs, append = false }) {
    if (append && this.songs) {
      this.songs = ([] as Song[]).concat(this.songs, songs);
      this.hasMoreSongs = false;
    } else {
      this.hasMoreSongs = songs.length > SEARCH_DEFAULTS.SONG_COUNT;
      this.songs = songs.splice(0, SEARCH_DEFAULTS.SONG_COUNT);
    }
  }

  @Mutation
  resetSearch(query) {
    this.albums = [];
    this.artists = [];
    this.songs = [];
    this.query = query;
  }

  @Action
  async search({ query }) {
    const params = {
      query: query,
      artistCount: SEARCH_DEFAULTS.ARTIST_COUNT + 1,
      albumCount: SEARCH_DEFAULTS.ALBUM_COUNT + 1,
      songCount: SEARCH_DEFAULTS.SONG_COUNT + 1
    } as SearchParams;
    this.context.commit("resetSearch", query);
    const response: SearchResponse = await Vue.prototype.axios.get(`search3`, {
      params: params
    });

    this.context.commit("setArtists", {
      artists: response.searchResult3.artist || []
    });
    this.context.commit("setAlbums", {
      albums: response.searchResult3.album || []
    });
    this.context.commit("setSongs", {
      songs: response.searchResult3.song || []
    });
  }

  @Action
  async searchMore({ type }) {
    const params = {
      query: this.context.getters["query"],
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
    const response: SearchResponse = await Vue.prototype.axios.get(`search3`, {
      params: params
    });

    switch (type) {
      case "artists":
        this.context.commit("setArtists", {
          artists: response.searchResult3.artist,
          append: true
        });
        break;
      case "albums":
        this.context.commit("setAlbums", {
          albums: response.searchResult3.album,
          append: true
        });
        break;
      case "songs":
        this.context.commit("setSongs", {
          songs: response.searchResult3.song,
          append: true
        });
        break;
    }
  }
}
