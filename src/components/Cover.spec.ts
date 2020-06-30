import Cover from "@/components/Cover.vue";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import "jest";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Cover", () => {
  const mountFunction = options => {
    return mount(Cover, { localVue, ...options });
  };

  beforeEach(() => {});

  it("should show a play button if the entity is not an artist", () => {
    const wrapper = mountFunction({
      propsData: {
        type: "album",
        entity: {}
      }
    });
    expect(wrapper.contains("v-btn"));
  });

  it("should not show a play button if the entity is an artist", () => {
    const wrapper = mountFunction({
      propsData: {
        type: "artist",
        entity: {}
      }
    });
    expect(wrapper.contains("v-btn")).toBeFalsy();
  });

  it("should return the correct icon for artist", () => {
    expect(Cover["computed"].icon.call({ type: "artist" })).toEqual(
      "mdi-account"
    );
  });

  it("should return the correct icon for album", () => {
    expect(Cover["computed"].icon.call({ type: "album" })).toEqual("mdi-album");
  });

  it("should return the correct icon for playlist", () => {
    expect(Cover["computed"].icon.call({ type: "playlist" })).toEqual(
      "mdi-playlist"
    );
  });
});
