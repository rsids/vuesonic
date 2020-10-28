import Vue from "vue";
import { Action, Module, VuexModule } from "vuex-module-decorators";

@Module({ namespaced: true })
export default class AnnotationStore extends VuexModule {
  @Action
  async star({ id, albumId, artistId, toggle }) {
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
    await Vue.prototype.axios.get(`${action}?${params.join("&")}`);
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
  }
}
