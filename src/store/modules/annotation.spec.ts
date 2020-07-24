import "jest";
import { annotation as annotationStore } from "@/store/modules/annotation";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";
import Mock = jest.Mock;
import { album } from "@/store/modules/album";
import { playlist } from "@/store/modules/playlist";
import Vue from "vue";
jest.mock("@/plugins/axios");
jest.mock("@/store/modules/playlist");
jest.mock("@/store/modules/album");

fdescribe("annotation store", () => {
  let store;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({
      modules: {
        album: cloneDeep(album),
        playlist: cloneDeep(playlist),
        annotation: cloneDeep(annotationStore)
      }
    });
  });

  describe("actions", () => {
    let mock;

    beforeEach(() => {
      mock = (Vue.prototype.axios["get"] as Mock).mockImplementationOnce(() =>
        Promise.resolve({})
      );
      store.commit = jest.fn();
    });

    describe("star", () => {
      it("add a star to the specified song", async () => {
        const promise = store.dispatch("annotation/star", {
          id: 42,
          toggle: true
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?id=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].id).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeTruthy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });

      it("add a star to the specified album", async () => {
        const promise = store.dispatch("annotation/star", {
          albumId: 42,
          toggle: true
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?albumId=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].albumId).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeTruthy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });

      it("add a star to the specified artist", async () => {
        const promise = store.dispatch("annotation/star", {
          artistId: 42,
          toggle: true
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?artistId=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].artistId).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeTruthy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });
    });

    describe("unstar", () => {
      it("remove the star to the specified song", async () => {
        // const mMock = (store.modules.album.mutations.updateStar).mock

        const promise = store.dispatch("annotation/star", {
          id: 42,
          toggle: false
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?id=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].id).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeFalsy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });

      it("remove the star to the specified album", async () => {
        const promise = store.dispatch("annotation/star", {
          albumId: 42,
          toggle: false
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?albumId=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].albumId).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeFalsy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });

      it("remove the star to the specified artist", async () => {
        const promise = store.dispatch("annotation/star", {
          artistId: 42,
          toggle: false
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?artistId=42"]);
        expect(store.commit.mock.calls[0][0]).toEqual("album/updateStar");
        expect(store.commit.mock.calls[0][1].artistId).toEqual(42);
        expect(store.commit.mock.calls[0][1].toggle).toBeFalsy();
        expect(store.commit.mock.calls[1][0]).toEqual("playlist/updateStar");
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
