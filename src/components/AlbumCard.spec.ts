import AlbumCard from "@/components/AlbumCard.vue";
import "jest";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("AlbumCard", () => {
  const mountFunction = options => {
    return mount(AlbumCard, { localVue, ...options });
  };

  it("should return the album name from the prop album", () => {
    expect(
      AlbumCard["computed"].albumName.call({
        album: { album: "TestName", name: "Unused" }
      })
    ).toEqual("TestName");
  });

  it("should return the album name from the prop name", () => {
    expect(
      AlbumCard["computed"].albumName.call({ album: { name: "TestName" } })
    ).toEqual("TestName");
  });

  it("should fetch the album url", () => {
    const album = {
      artist: "Foo Fighters",
      name: "The Colour And the Shape",
      id: 42
    };
    // @todo Add correct type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = mountFunction({ propsData: { album: album } }) as any;
    expect(wrapper.vm.getAlbumUrl(42)).toEqual(
      `/library/albums/42/foo-fighters/the-colour-and-the-shape`
    );
  });
});
