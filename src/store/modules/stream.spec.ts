import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import StreamStore from "@/store/modules/stream";
import album from "@/../__mocks__/album.json";
import Vue from "vue";
import { cloneDeep } from "lodash";
import { Song } from "@/store/interfaces/song";
import ServerStore from "@/store/modules/server";

/**
 * Unittests for the stream store.
 * Note: the "play" action of the media element is a promise,
 * testing for changes after executing the play action need to
 * be placed inside a promise
 */
describe("stream store", () => {
  let store: Store<StreamStore>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store({
      modules: {
        stream: cloneDeep(StreamStore),
        server: cloneDeep(ServerStore),
      },
    });
  });

  beforeEach(() => {
    store.commit("server/storeCredentials", {
      user: "test",
      password: "test",
      server: "http://testserver",
    });
  });

  describe("mutations", () => {
    describe("index", () => {
      beforeEach(() => {
        store.commit("stream/setPlaylist", {
          playlist: [{} as Song, {} as Song, {} as Song],
        });
      });

      it("should set the index", () => {
        store.commit("stream/setIdx", 1);
        expect(store.state["stream"].idx).toEqual(1);
        expect(store.state["stream"].hasPrev).toEqual(true);
        expect(store.state["stream"].hasNext).toEqual(true);
      });

      it("should set hasPrev to false if index === 0", () => {
        store.commit("stream/setIdx", 0);
        expect(store.state["stream"].idx).toEqual(0);
        expect(store.state["stream"].hasPrev).toEqual(false);
        expect(store.state["stream"].hasNext).toEqual(true);
      });

      it("should set hasNext to false if index is last item of playlist", () => {
        store.commit("stream/setIdx", 2);
        expect(store.state["stream"].idx).toEqual(2);
        expect(store.state["stream"].hasPrev).toEqual(true);
        expect(store.state["stream"].hasNext).toEqual(false);
      });
    });

    it("should set the repeat property", () => {
      store.commit("stream/setRepeat", true);
      expect(store.state["stream"].repeat).toEqual(true);
    });

    it("should set the paused property to true", () => {
      store.commit("stream/setPaused");
      expect(store.state["stream"].paused).toEqual(true);
    });

    it("should set the progress to 42", () => {
      store.commit("stream/setProgress", 42);
      expect(store.state["stream"].progress).toEqual(42);
    });

    it("should set the paused property to false if a song is set", () => {
      const song = { ...album.song[0] };
      store.commit("stream/setSong", song);
      store.commit("stream/setPlaying");
      Promise.resolve().then(() => {
        expect(store.state["stream"].paused).toEqual(false);
      });
    });

    it("should not set the paused property to false if no song is set", () => {
      store.commit("stream/setPlaying");
      Promise.resolve().then(() => {
        expect(store.state["stream"].paused).toEqual(true);
      });
    });

    it("should set the current song", () => {
      const song = { ...album.song[0] };
      store.commit("stream/setSong", song);
      expect(store.state["stream"].song).toEqual(song);
      expect(store.state["stream"].progress).toEqual(0);
    });

    it("should set the playlist", () => {
      const songs = [...album.song];
      store.commit("stream/setPlaylist", { playlist: songs });
      expect(store.state["stream"].playlist).toEqual(songs);
      expect(store.state["stream"].history).toEqual([]);
    });

    it("should set the progress when the audio element sends a timeupdate event", () => {
      const event = new Event("timeupdate");
      store.dispatch("stream/init");
      // Set to fake value
      store.commit("stream/setProgress", 42);
      // Call event, which will reset to 0
      store.state["stream"].audio.dispatchEvent(event);

      expect(store.state["stream"].progress).toEqual(0);
    });
  });

  describe("actions", () => {
    it("should create the playlist and start playing", async () => {
      await store.dispatch("stream/playNow", {
        songs: [...album.song],
      });

      expect(store.state["stream"].idx).toEqual(0);

      Promise.resolve().then(() => {
        expect(store.state["stream"].paused).toEqual(false);
        expect(store.state["stream"].playlist).toEqual(album.song);
        expect(store.state["stream"].song).toEqual(album.song[0]);
        expect(store.state["stream"].hasNext).toEqual(true);
        expect(store.state["stream"].hasPrev).toEqual(false);
      });
    });

    it("should next the previous song in the playlist", async () => {
      store.commit("stream/setPlaylist", { playlist: [...album.song] });
      store.commit("stream/setIdx", 0);

      await store.dispatch("stream/next");

      expect(store.state["stream"].idx).toEqual(1);
      Promise.resolve().then(() => {
        expect(store.state["stream"].hasNext).toEqual(true);
        expect(store.state["stream"].paused).toEqual(false);
        expect(store.state["stream"].song).toEqual(album.song[1]);
      });
    });

    it("should play the previous song in the playlist", async () => {
      store.commit("stream/setPlaylist", { playlist: [...album.song] });
      store.commit("stream/setIdx", 5);

      await store.dispatch("stream/prev");

      expect(store.state["stream"].idx).toEqual(4);
      Promise.resolve().then(() => {
        expect(store.state["stream"].hasNext).toEqual(true);
        expect(store.state["stream"].paused).toEqual(false);
        expect(store.state["stream"].song).toEqual(album.song[4]);
      });
    });

    it("should insert the song after the song currently being played", () => {
      store.commit("stream/setPlaylist", { playlist: [...album.song] });
      store.commit("stream/setIdx", 2);
      store.commit("stream/setSong", { ...album.song[2] });

      // Check orinal playlist
      expect(store.state["stream"].playlist.length).toEqual(11);
      expect(store.state["stream"].playlist[3].id).toEqual(1308);

      store.dispatch("stream/playNext", { songs: [{ ...album.song[0] }] });

      // Check updated playlist
      expect(store.state["stream"].playlist.length).toEqual(12);
      expect(store.state["stream"].playlist[3].id).toEqual(1309);
    });

    it("should play the song at the given index", async () => {
      store.commit("stream/setPlaylist", { playlist: [...album.song] });

      await store.dispatch("stream/playIndex", 5);

      expect(store.state["stream"].idx).toEqual(5);
      Promise.resolve().then(() => {
        expect(store.state["stream"].hasNext).toEqual(true);
        expect(store.state["stream"].paused).toEqual(false);
        expect(store.state["stream"].song).toEqual(album.song[5]);
      });
    });
  });

  afterEach(() => {
    Vue.prototype.axios["get"].mockReset();
  });
});
