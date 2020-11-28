import { Artist } from "@/store/interfaces/artist";
import { Index } from "@/store/interfaces";
import Vue from "vue";
import {
  Module,
  Mutation,
  MutationAction,
  VuexModule,
} from "vuex-module-decorators";
import { namespace } from "vuex-class";

export const artist = namespace("artist");

@Module({ namespaced: true })
export default class ArtistStore extends VuexModule {
  artists: Artist[] = [];
  currentArtist: Artist | null = null;

  @Mutation
  setArtist(value: Artist): void {
    this.currentArtist = value;
  }

  @MutationAction
  async getArtists(): Promise<unknown> {
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
  async getArtist({ id }: { id: number }): Promise<unknown> {
    const response = await Vue.prototype.axios.get(`getArtist?id=${id}`);
    if (response?.artist) {
      return { currentArtist: response.artist };
    }
    return { currentArtist: null };
  }
}
