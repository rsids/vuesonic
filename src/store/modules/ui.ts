import { namespace } from "vuex-class";
import { Module, Mutation, VuexModule } from "vuex-module-decorators";

export const ui = namespace("ui");

@Module({ namespaced: true })
export default class UiStore extends VuexModule {
  drawer = false;
  tabs: string[] = ["recents", "playlists", "artists", "albums", "starred"];
  tab!: string;

  @Mutation
  setDrawer(value: boolean): void {
    this.drawer = value;
  }

  @Mutation
  setTab(value: string): void {
    this.tab = value;
  }

  @Mutation
  setTabs(value: string[]): void {
    this.tabs = value;
  }
}
