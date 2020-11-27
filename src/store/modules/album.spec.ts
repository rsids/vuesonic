import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import AlbumStore from "@/store/modules/album";
import album from "@/../__mocks__/album.json";
import Vue from "vue";
import { Cover } from "@/store/interfaces/cover";
import { Song } from "@/store/interfaces/song";
// import Mock = jest.Mock;

// jest.mock("axios");
describe("album store", () => {
  let store: Store<AlbumStore>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({
      modules: {
        album: AlbumStore,
      },
    });
  });

  describe("mutations", () => {
    it("should set the recent albums", () => {
      store.commit("album/setRecents", [{ ...album }]);
      expect(store.state["album"].recents).toEqual([album]);
    });

    it("should set the current album", () => {
      store.commit("album/setAlbum", { ...album });
      expect(store.state["album"].currentAlbum).toEqual(album);
    });

    it("should set the albums", () => {
      store.commit("album/setAlbums", {
        albums: [{ ...album }],
        hasMoreAlbums: false,
      });
      expect(store.state["album"].albums).toEqual([album]);
      expect(store.state["album"].hasMoreAlbums).toBeFalsy();
    });

    it("should set the cover", () => {
      const cover: Cover = {
        id: "73",
        cover: "coverArt",
      };
      store.commit("album/setCover", cover);
      expect(store.state["album"].covers.has("73")).toBeTruthy();
      expect(store.state["album"].covers.get("73")).toEqual("coverArt");
    });

    it("star the album by albumId", () => {
      store.commit("album/setAlbum", { ...album });
      expect(store.state["album"].currentAlbum.starred).toBeFalsy();

      store.commit("album/updateStar", { albumId: 73, toggle: true });
      expect(store.state["album"].currentAlbum.starred).toBeTruthy();
    });

    it("star song by Id", () => {
      store.commit("album/setAlbum", { ...album });
      expect(store.state["album"].currentAlbum.starred).toBeFalsy();

      store.commit("album/updateStar", { id: 1305, toggle: true });
      expect(
        store.state["album"].currentAlbum?.song.find((s: Song) => s.id === 1305)
          ?.starred
      ).toBeTruthy();
    });
  });

  describe("actions", () => {
    describe("getRecents", () => {
      it("should get the recent albums", async () => {
        Vue.prototype.axios["get"].mockImplementationOnce(() =>
          Promise.resolve({
            albumList: {
              album: [album],
            },
          })
        );

        const promise = store.dispatch("getRecents");
        await promise;
        expect(store.state.recents).toEqual([album]);
        // request.done();
      });
    });
  });
  //
  //   describe("getAlbums", () => {
  //     it("should get an alfabetical list of albums", async () => {
  //       (Vue.prototype.axios["get"] as Mock).mockImplementationOnce(() =>
  //         Promise.resolve({
  //           albumList: {
  //             album: [album]
  //           }
  //         })
  //       );
  //       const promise = store.dispatch("getAlbums", { start: 0 });
  //       await promise;
  //       expect(store.state.albums).toEqual([album]);
  //       expect(store.state.hasMoreAlbums).toEqual(false);
  //     });
  //
  //     it("should set hasMoreAlbums to true if getAlbums returns > 20 albums", async () => {
  //       (Vue.prototype.axios["get"] as Mock).mockImplementationOnce(() =>
  //         Promise.resolve({
  //           albumList: {
  //             album: Array(21).fill(album)
  //           }
  //         })
  //       );
  //       const promise = store.dispatch("getAlbums", { start: 0 });
  //       await promise;
  //       expect(store.state.albums.length).toEqual(20);
  //       expect(store.state.hasMoreAlbums).toEqual(true);
  //     });
  //   });
  //
  //   describe("getAlbum", () => {
  //     it("should fetch the album from the backend", async () => {
  //       (Vue.prototype.axios["get"] as Mock).mockImplementation(() =>
  //         Promise.resolve({
  //           album: album
  //         })
  //       );
  //       const promise = store.dispatch("getAlbum", { id: 73 });
  //       await promise;
  //       expect(store.state.currentAlbum).toEqual(album);
  //     });
  //
  //     it("should fetch the album only once from the backend", async () => {
  //       const mock = (Vue.prototype.axios["get"] as Mock).mockImplementation(
  //         () =>
  //           Promise.resolve({
  //             album: album
  //           })
  //       );
  //       let promise = store.dispatch("getAlbum", { id: 73 });
  //       await promise;
  //       promise = store.dispatch("getAlbum", { id: 73 });
  //       await promise;
  //       expect(store.state.currentAlbum).toEqual(album);
  //       expect(mock.mock.calls.length).toEqual(1);
  //     });
  //   });
  //
  //   describe("getAlbumFromMusicDirectory", () => {
  //     it("should get the musicdirectory first, then the album", async () => {
  //       const mock = (Vue.prototype.axios["get"] as Mock)
  //         .mockImplementationOnce(() =>
  //           Promise.resolve({
  //             directory: {
  //               child: [
  //                 {
  //                   albumId: 73
  //                 }
  //               ]
  //             }
  //           })
  //         )
  //         .mockImplementationOnce(() =>
  //           Promise.resolve({
  //             album: album
  //           })
  //         );
  //       const promise = store.dispatch("getAlbumFromMusicDirectory", {
  //         id: 73
  //       });
  //       await promise;
  //       expect(store.state.currentAlbum).toEqual(album);
  //       expect(mock.mock.calls.length).toEqual(2);
  //     });
  //
  //     it("should get cache the musicdirectory ", async () => {
  //       const mock = (Vue.prototype.axios["get"] as Mock)
  //         .mockImplementationOnce(() =>
  //           Promise.resolve({
  //             directory: {
  //               child: [
  //                 {
  //                   albumId: 73
  //                 }
  //               ]
  //             }
  //           })
  //         )
  //         .mockImplementationOnce(() =>
  //           Promise.resolve({
  //             album: album
  //           })
  //         );
  //       let promise = store.dispatch("getAlbumFromMusicDirectory", {
  //         id: 73
  //       });
  //       await promise;
  //       promise = store.dispatch("getAlbumFromMusicDirectory", { id: 73 });
  //       await promise;
  //       expect(store.state.currentAlbum).toEqual(album);
  //       expect(mock.mock.calls.length).toEqual(2);
  //     });
  //   });
  // });

  afterEach(() => {
    // mockAxios.reset();
    // nock.restore();
    // jest.clearAllMocks();
  });
});
