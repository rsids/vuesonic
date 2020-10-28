import { Artist } from "@/store/interfaces/artist";
import { Index } from "@/store/interfaces";
import Vue from "vue";
import {
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from "vuex-module-decorators";

@Module({ namespaced: true })
export default class ArtistStore extends VuexModule {
  artists: Artist[] = [];
  currentArtist!: Artist;

  @Mutation
  setArtist(value: Artist) {
    this.currentArtist = value;
  }

  @MutationAction
  async getArtists() {
    const response = await Vue.prototype.axios.get(`getArtists`);

    const artists: Artist[] = [];
    if (response.artists) {
      response.artists.index.forEach((idx: Index) => {
        artists.push(...idx.artist);
      });
    }
    return { artists };
  }

  @MutationAction
  async getArtist({ id }) {
    const response = await Vue.prototype.axios.get(`getArtist?id=${id}`);
    if (response?.artist) {
      return { currentArtist: response.artist };
    }
    return { currentArtist: null };
  }
}
