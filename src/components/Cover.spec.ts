import Cover from "@/components/Cover.vue";
import Vuex from "vuex";
import { expect } from "chai";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Cover", () => {
  let vuetify;
  const mountFunction = options => {
    return mount(Cover, {
      localVue,
      vuetify,
      ...options
    });
  };

  beforeEach(() => {
    vuetify = new Vuetify();
  });

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
    expect(wrapper.contains("v-btn")).to.be.false;
  });

  it("should return the correct icon for artist", () => {
    expect(Cover["computed"].icon.call({ type: "artist" })).to.equal(
      "mdi-account"
    );
  });

  it("should return the correct icon for album", () => {
    expect(Cover["computed"].icon.call({ type: "album" })).to.equal(
      "mdi-album"
    );
  });

  it("should return the correct icon for playlist", () => {
    expect(Cover["computed"].icon.call({ type: "artust" })).to.equal(
      "mdi-playlist"
    );
  });
});
