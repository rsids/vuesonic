import "jest";
import { SET_TAB, SET_TABS, ui, UiState } from "@/store/modules/ui";
import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { cloneDeep } from "lodash";

describe("ui store", () => {
  let store: Store<UiState>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store(cloneDeep(ui));
  });
  describe("mutations", () => {
    it("should set the tabs", () => {
      store.commit(SET_TABS, ["1", "2", "3"]);
      expect(store.state.tabs).toEqual(["1", "2", "3"]);
    });
    it("should set the tab", () => {
      store.commit(SET_TAB, "boink");
      expect(store.state.tab).toEqual("boink");
    });
  });
});
