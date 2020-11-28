import Cover from "@/components/Cover.vue";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import "jest";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Cover", () => {
  const mountFunction = (options) => {
    return mount(Cover, { localVue, ...options });
  };

  it("should show a play button if the entity is not an artist", (done) => {
    const wrapper = mountFunction({
      propsData: {
        type: "album",
        entity: {},
      },
    });
    wrapper.find(".cover-container").trigger("mouseover");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(".btn--play").exists()).toBeTruthy();
      done();
    });
  });

  it("should not show a play button if the entity is an artist", (done) => {
    const wrapper = mountFunction({
      propsData: {
        type: "artist",
        entity: {},
      },
    });
    wrapper.find(".cover-container").trigger("mouseover");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(".btn--play").exists()).toBeFalsy();
      done();
    });
  });

  it("should return the correct icon for artist", () => {
    const c = new Cover();
    const type = "artist";
    expect((c.$options?.computed?.icon as any).get.call({ type })).toEqual(
      "mdi-account"
    );
  });

  it("should return the correct icon for album", () => {
    const c = new Cover();
    const type = "album";
    expect((c.$options?.computed?.icon as any).get.call({ type })).toEqual(
      "mdi-album"
    );
  });

  it("should return the correct icon for playlist", () => {
    const c = new Cover();
    const type = "playlist";
    expect((c.$options?.computed?.icon as any).get.call({ type })).toEqual(
      "mdi-playlist"
    );
  });
});
