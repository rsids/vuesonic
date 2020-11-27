import AlbumCard from "@/components/AlbumCard.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

describe("AlbumCard", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify;

  const mountFunction = (options) => {
    return mount(AlbumCard, { localVue, vuetify, ...options });
  };

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("should return the album name from the prop album", () => {
    const wrapper = mountFunction({
      stubs: {
        Cover: true,
      },
      propsData: {
        album: { album: "TestName", name: "Unused", artist: "Joe Artist" },
      },
    });

    const title = wrapper.find(".subtitle-1 div");
    const artist = wrapper.find("[x-cy=artist]");

    expect(title.text()).toEqual("TestName");
    expect(artist.text()).toEqual("Joe Artist");
  });

  it("should return the album name from the prop name", () => {
    const wrapper = mountFunction({
      stubs: {
        Cover: true,
      },
      propsData: {
        album: { name: "TestName", artist: "Joe Artist" },
      },
    });
    const title = wrapper.find(".subtitle-1 div");

    expect(title.text()).toEqual("TestName");
  });

  it("should fetch the album url", async () => {
    const mockRouter = {
      push: jest.fn(),
    };

    const mockStore = new Vuex.Store({
      modules: {
        album: {
          actions: {
            cancelAllRequests: jest.fn(),
          },
          namespaced: true,
        },
      },
    });

    const album = {
      artist: "Foo Fighters",
      name: "The Colour And the Shape",
      id: 42,
    };

    const wrapper = mountFunction({
      stubs: {
        Cover: true,
      },
      mocks: {
        $store: mockStore,
        $router: mockRouter,
      },
      propsData: {
        album,
      },
    });
    await wrapper.find(".album-card").trigger("click");

    expect(mockRouter.push).toHaveBeenCalledWith(
      `/library/albums/42/foo-fighters/the-colour-and-the-shape`
    );
  });
});
