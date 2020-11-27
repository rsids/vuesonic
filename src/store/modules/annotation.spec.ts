import AnnotationStore from "@/store/modules/annotation";
import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { cloneDeep } from "lodash";
import Vue from "vue";
import Mock = jest.Mock;

describe("annotation store", () => {
  let store: Store<AnnotationStore>;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({
      modules: {
        annotation: cloneDeep(AnnotationStore),
      },
    });
  });

  describe("actions", () => {
    let mock;

    beforeEach(() => {
      mock = Vue.prototype.axios["get"].mockImplementationOnce(() =>
        Promise.resolve({})
      );
      store.commit = jest.fn();
    });

    describe("star", () => {
      it("add a star to the specified song", async () => {
        const promise = store.dispatch("annotation/star", {
          id: 42,
          toggle: true,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?id=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].id).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeTruthy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });

      it("add a star to the specified album", async () => {
        const promise = store.dispatch("annotation/star", {
          albumId: 42,
          toggle: true,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?albumId=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].albumId).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeTruthy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });

      it("add a star to the specified artist", async () => {
        const promise = store.dispatch("annotation/star", {
          artistId: 42,
          toggle: true,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["star?artistId=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].artistId).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeTruthy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });
    });

    describe("unstar", () => {
      it("remove the star to the specified song", async () => {
        // const mMock = (store.modules.album.mutations.updateStar).mock

        const promise = store.dispatch("annotation/star", {
          id: 42,
          toggle: false,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?id=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].id).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeFalsy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });

      it("remove the star to the specified album", async () => {
        const promise = store.dispatch("annotation/star", {
          albumId: 42,
          toggle: false,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?albumId=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].albumId).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeFalsy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });

      it("remove the star to the specified artist", async () => {
        const promise = store.dispatch("annotation/star", {
          artistId: 42,
          toggle: false,
        });
        await promise;
        expect(mock.mock.calls.length).toEqual(1);
        expect(mock.mock.calls[0]).toEqual(["unstar?artistId=42"]);
        expect((store.commit as Mock).mock.calls[0][0]).toEqual(
          "album/updateStar"
        );
        expect((store.commit as Mock).mock.calls[0][1].artistId).toEqual(42);
        expect((store.commit as Mock).mock.calls[0][1].toggle).toBeFalsy();
        expect((store.commit as Mock).mock.calls[1][0]).toEqual(
          "playlist/updateStar"
        );
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
