import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { cloneDeep } from "lodash";
import UiStore from "@/store/modules/ui";

describe("ui store", () => {
  let store: Store<UiStore>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({ modules: { ui: cloneDeep(UiStore) } });
  });

  describe("mutations", () => {
    it("should set the tabs", () => {
      store.commit("ui/setTabs", ["1", "2", "3"]);
      expect(store.state["ui"].tabs).toEqual(["1", "2", "3"]);
    });

    it("should set the tab", () => {
      store.commit("ui/setTab", "boink");
      expect(store.state["ui"].tab).toEqual("boink");
    });
  });
});
