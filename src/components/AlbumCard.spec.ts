import AlbumCard from "@/components/AlbumCard.vue";
// import "jest";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
// import Vuex from "vuex";
//
// localVue.use(Vuex);
//
describe("AlbumCard", () => {
  const localVue = createLocalVue();
  let vuetify;

  const mountFunction = (options) => {
    return mount(AlbumCard, { localVue, vuetify, ...options });
  };

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("should return the album name from the prop album", () => {
    const wrapper = mountFunction({
      album: { album: "TestName", name: "Unused" },
    });

    expect(wrapper["$vm"].albumName).toEqual("TestName");
  });
  //
  //   it("should return the album name from the prop album", () => {
  //     expect(
  //       AlbumCard["computed"].albumName.call({
  //         album: { album: "TestName", name: "Unused" }
  //       })
  //     ).toEqual("TestName");
  //   });
  //
  //   it("should return the album name from the prop name", () => {
  //     expect(
  //       AlbumCard["computed"].albumName.call({ album: { name: "TestName" } })
  //     ).toEqual("TestName");
  //   });
  //
  //   it("should fetch the album url", () => {
  //     const album = {
  //       artist: "Foo Fighters",
  //       name: "The Colour And the Shape",
  //       id: 42
  //     };
  //     // @todo Add correct type
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const wrapper = mountFunction({ propsData: { album: album } }) as any;
  //     expect(wrapper.vm.getAlbumUrl(42)).toEqual(
  //       `/library/albums/42/foo-fighters/the-colour-and-the-shape`
  //     );
  //   });
});
