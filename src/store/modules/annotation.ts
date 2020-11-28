import Vue from "vue";
import { Action, Module, VuexModule } from "vuex-module-decorators";
import { SubsonicResponse } from "@/store/interfaces/subsonicResponse";
import { namespace } from "vuex-class";

export const annotation = namespace("annotation");

@Module({ namespaced: true })
export default class AnnotationStore extends VuexModule {
  @Action
  async star({
    id,
    albumId,
    artistId,
    toggle,
  }: {
    id: number;
    albumId: number;
    artistId: number;
    toggle: boolean;
  }): Promise<unknown> {
    const params: string[] = [];
    const action = toggle ? "star" : "unstar";
    if (id) {
      params.push(`id=${id}`);
    }
    if (albumId) {
      params.push(`albumId=${albumId}`);
    }
    if (artistId) {
      params.push(`artistId=${artistId}`);
    }
    const result: SubsonicResponse = await Vue.prototype.axios.get(
      `${action}?${params.join("&")}`
    );
    this.context.commit(
      "album/updateStar",
      { id, albumId, artistId, toggle },
      { root: true }
    );
    this.context.commit(
      "playlist/updateStar",
      { id, albumId, artistId, toggle },
      { root: true }
    );
    return result;
  }
}
